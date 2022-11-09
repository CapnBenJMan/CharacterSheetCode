/** Edits the weapons cells by either clearing their values and notes or autofilling their values by opening an HTML dialog
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function weapons(e) {
	const characterSheet = e.source.getSheetByName('Character') // define reference to Character sheet
	const rrow = e.range.getRow() // get the row of the edited range
	if (e.range.getSheet().getName() == 'Character' && // if edited range is on the character sheet
		isWithinRange(e.range, characterSheet.getRange('Character!R32:W36')).tf) {
		// ^^and edited range is within the weapons range
		if (isEmptyish(e.value)) { // if user hit backspace
			characterSheet.getRange(rrow, 25).clear({ contentsOnly: true }).clearNote() // clear the contents and notes of each cell in the row
			characterSheet.getRange(rrow, 29).clear({ contentsOnly: true }).clearNote() // ^^^
		} else if (!isEmptyish(e.value) && isEmptyish(e.oldValue)) { // otherwise if user is adding a name to a previously empty cell
			characterSheet.getRange('AV4').setValue(rrow) // store current row in sheet
			openHTML('weapon') // open weapon dialog
		}
	}
}

/** Applies the values passed into the function to the edited cell
 * @param {string} name 
 * @param {boolean} prof
 * @param {boolean} addBonus
 * @param {{bonus: number, attBonus: number, damBonus: number}} bonuses
 * @param {{name: string, damage: string, props: string[], type: string, }} custom
 * @param {{bool: boolean, val: string, mw: boolean}} override
 */
function weaponSetter(name, prof, addBonus, bonuses, custom, override) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const ui = SpreadsheetApp.getUi() // define ui reference
	const characterSheet = ss.getSheetByName('Character') // define reference to character sheet
	const rrow = Number(characterSheet.getRange('AV4').getValue()) // get edited row from storage
	characterSheet.getRange('AV4').clearContent() // clear storage position
	const Weapons = weaponInfo() // get array of weapon objects
	const weapon = (name.toLowerCase() != 'custom') ? // if name is not custom
		Weapons.find(x => x.name == name.toLowerCase()) : // return the object that matches the inputted name
		{ ...custom } // or the spread of the custom object parameter
	const dmg = weapon.damage.split(' ') // dmg = the split value of the weapon's damage

	/** @type {string} */ var stat // declare stat, to be defined below
	if (weapon.type == 'ranged') stat = 'Dex' // if weapon is ranged, stat is dex
	else if (weapon.type == 'melee') stat = 'Str' // else if weapon is melee, stat is str

	if (!override.bool && weapon.props.includes('Finesse') && weapon.type == 'melee') { // if weapon has the finesse property
		const res1 = ui.alert(`The weapon type you entered has the Finesse property.\n` +
			`Would you like to use Dexterity instead of Strength?`,
			ui.ButtonSet.YES_NO) // ask which stat the user would prefer to use

		if (res1 == ui.Button.YES) stat = 'Dex' // and set stat accordingly
		else if (res1 == ui.Button.NO) stat = 'Str'
	}

	/** Returns a number compiled as a string that begins with either + or -
	 * @param {number} n */
	let bonusCompiler = (n, i = false) => n != 0 ? `${i ? '(' : ''}${(n < 0 ? `${n}` : n > 0 ? `+${n}` : '')}${i ? ')' : ''}` : ''
	let noteBuilder = x => {
		/** Capitalizes the traits of the weapon
		 * @param {string} v */
		let capitalizer = v => {
			if (v.includes(' ')) { // if v includes spaces
				const arr = v.split(" ") // split v on spaces
				for (j in arr) { // loop through arr
					if (arr[j].includes('\n')) break // break the loop if arr[j] includes \n
					else arr[j] = arr[j].charAt(0).toUpperCase() + arr[j].slice(1).toLowerCase()
					// ^otherwise set arr[j] to itself capitalized
				}
				return arr.join(" ") // return the reformatted array joined by spaces
			} else return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() // otherwise, return capitalized word
		}

		const name = capitalizer(x.name) + bonusCompiler(bonuses.bonus) // capitalize name and add bonus
		const damg = capitalizer(x.damage) + ' Damage' +
			((addBonus && (bonuses.attBonus != 0 || bonuses.damBonus != 0)) ?
				('\nAdditional Bonuses:' +
					((bonuses.attBonus != 0) ? `\n\tAttack: ${bonusCompiler(bonuses.attBonus)}` : '') +
					((bonuses.damBonus != 0) ? `\n\tDamage: ${bonusCompiler(bonuses.damBonus)}` : ''))
				: '')
		const props = capitalizer(x.props.join(', ')) // capitalize properties and join with ", "
		if (props != '-') { // if weapon has properties...
			return [name, damg, props].join('\n') // return the name, damage, and properties joined by \n
		} else { // otherwise...
			return [name, damg].join('\n') // return name and damage joined by \n
		}
	}

	const MartialArts = (ss.getRangeByName('MonkLvl') != null) && // the character has at least 1 level in monk and
		(override.mw || // ^^the inputted weapon is a monk weapon or
			['shortsword', 'unarmed strike'].some(x => weapon.name.toLowerCase() == x) || // ^^the inputted weapon is a shortsword or unarmed strke or
			!['Heavy', 'Two-Handed', 'Two Handed'].some(x => weapon.props.includes(x))) // ^^the inputted weapon is not heavy or two handed
	// ^whether or not this weapon uses martial arts
	var useMA = weapon.name.toLowerCase() == 'unarmed strike' && MartialArts
	// Sets the stat if it's not already Dex, if the stat isn't being overrided, and if MartialArts evaluates true
	if (stat != 'Dex' && !override.bool && MartialArts) {
		var response1 = ui.alert(
			"You have at least 1 level in Monk.\n" +
			"Would you like to use your Dexterity instead of Strength?",
			ui.ButtonSet.YES_NO)
		if (response1 == ui.Button.YES) stat = 'Dex'
	}
	if (!useMA && !override.bool && MartialArts && weapon.name.toLowerCase() != 'unarmed strike') {
		var response1 = ui.alert(
			"You have at least 1 level in Monk.\n" +
			"Would you like to use your Martial Arts die in place of your weapon's regular damage?",
			ui.ButtonSet.YES_NO)
		useMA = (response1 == ui.Button.YES)
	}
	stat = override.bool ? override.val : stat
	var note = noteBuilder(weapon)
	var addAttack = stat + bonusCompiler(bonuses.bonus) + (addBonus ? bonusCompiler(bonuses.attBonus) : '') + (prof ? '+Prof' : ''),
		addDamage = stat + bonusCompiler(bonuses.bonus) + (addBonus ? bonusCompiler(bonuses.damBonus) : '')
	const frmla = {
		atk: `=if(text(${addAttack}, "0")="0", "+0", ${addAttack})`,
		dmg: dmg[0] == '-' ? `="-"` :
			useMA ? `=if(text(${addDamage}, "0")="0", vlookup(MonkLvl,AR28:AS47,2,1), join("+",vlookup(MonkLvl,AR28:AS47,2,1),text(${addDamage},"0")))` :
				`=if(text(${addDamage}, "0")="0", "${dmg[0]}", ifs(${addDamage}>0,join("+","${dmg[0]}",text(${addDamage},"0")), ${addDamage}<0,join("","${dmg[0]}",text(${addDamage},"0"))))`
	} // define frmla object that contains attack and damage elements, each containing their own formulas
	if (useMA) note = note.replace(/^\d{1,2}d?\d{1,2} (.* Damage)$/m, '$1 equal to Martial Arts Die')
	// ^if weapon uses martial arts, modify note to show damage using martial arts dice
	if (useMA && weapon.name.toLowerCase() == 'unarmed strike') note = "Unarmed Strike\nBludgeoning Damage equal to Martial Arts Die"
	// ^if weapon is unarmed strike and if character uses martial arts, set unarmed strike note
	characterSheet.getRange(rrow, 25).setFormula(frmla.atk) // set attack formula
	characterSheet.getRange(rrow, 29).setFormula(frmla.dmg).setNote(note) // set damage formula and weapon detail note
}

/** Returns an array of objects that contains the information for each weapon */
function weaponInfo() {
	const melee = 'melee', ranged = 'ranged', ammunition = 'Ammunition', finesse = 'Finesse', heavy = 'Heavy',
		light = 'Light', loading = 'Loading', range = (nor, long) => `Range (${nor}/${long})`, reach = 'Reach',
		thrown = (nor, long) => `Thrown (${nor}/${long})`, twoHanded = 'Two-Handed', versatile = d => `Versatile (1d${d})`,
		special = a => {
			const l = `Special\n\nYou have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted.`
			const n = 'Special\n\nA Large or smaller creature hit by a net is Restrained until it is freed.' +
				' A net has no effect on creatures that are formless, or creatures that are Huge or larger.' +
				' A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success.' +
				' Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it, ending the effect and destroying the net.' +
				' When you use an action, bonus action, or reaction to attack with a net, you can make only one attack regardless of the number of attacks you can normally make.'
			switch (a) {
				case 'lance':
					return l
				case 'net':
					return n
				default:
					return ''
			}
		}
	// ^This series of const declarations was made for convenience during manual input of all the info below
	const weapon = [ // this is the array of weapon objects
		{ name: 'club', damage: '1d4 bludgeoning', props: [light], type: melee },
		{ name: 'dagger', damage: '1d4 piercing', props: [finesse, light, thrown(20, 60)], type: melee },
		{ name: 'greatclub', damage: '1d8 bludgeoning', props: [twoHanded], type: melee },
		{ name: 'handaxe', damage: '1d6 slashing', props: [light, thrown(20, 60)], type: melee },
		{ name: 'javelin', damage: '1d6 piercing', props: [thrown(20, 60)], type: melee },
		{ name: 'light hammer', damage: '1d4 bludgeoning', props: [light, thrown(20, 60)], type: melee },
		{ name: 'mace', damage: '1d6 bludgeoning', props: ['-'], type: melee },
		{ name: 'quarterstaff', damage: '1d6 bludgeoning', props: [versatile(8)], type: melee },
		{ name: 'sickle', damage: '1d4 slashing', props: [light], type: melee },
		{ name: 'spear', damage: '1d6 piercing', props: [thrown(20, 60), versatile(8)], type: melee },
		{ name: 'light crossbow', damage: '1d8 piercing', props: [ammunition, range(80, 320), loading, twoHanded], type: ranged },
		{ name: 'dart', damage: '1d4 piercing', props: [finesse, thrown(20, 60)], type: ranged },
		{ name: 'shortbow', damage: '1d6 piercing', props: [ammunition, range(80, 320), twoHanded], type: ranged },
		{ name: 'sling', damage: '1d4 bludgeoning', props: [ammunition, range(30, 120)], type: ranged },
		{ name: 'battleaxe', damage: '1d8 slashing', props: [versatile(10)], type: melee },
		{ name: 'flail', damage: '1d8 bludgeoning', props: ['-'], type: melee },
		{ name: 'glaive', damage: '1d10 slashing', props: [heavy, reach, twoHanded], type: melee },
		{ name: 'greataxe', damage: '1d12 slashing', props: [heavy, twoHanded], type: melee },
		{ name: 'greatsword', damage: '2d6 slashing', props: [heavy, twoHanded], type: melee },
		{ name: 'halberd', damage: '1d10 slashing', props: [heavy, reach, twoHanded], type: melee },
		{ name: 'lance', damage: '1d12 piercing', props: [reach, special('lance')], type: melee },
		{ name: 'longsword', damage: '1d8 slashing', props: [versatile(10)], type: melee },
		{ name: 'maul', damage: '2d6 bludgeoning', props: [heavy, twoHanded], type: melee },
		{ name: 'morningstar', damage: '1d8 piercing', props: ['-'], type: melee },
		{ name: 'pike', damage: '1d10 piercing', props: [heavy, reach, twoHanded], type: melee },
		{ name: 'rapier', damage: '1d8 piercing', props: [finesse], type: melee },
		{ name: 'scimitar', damage: '1d6 slashing', props: [finesse, light], type: melee },
		{ name: 'shortsword', damage: '1d6 piercing', props: [finesse, light], type: melee },
		{ name: 'trident', damage: '1d6 piercing', props: [thrown(20, 60), versatile(8)], type: melee },
		{ name: 'war pick', damage: '1d8 piercing', props: ['-'], type: melee },
		{ name: 'warhammer', damage: '1d8 bludgeoning', props: [versatile(10)], type: melee },
		{ name: 'whip', damage: '1d4 slashing', props: [finesse, reach], type: melee },
		{ name: 'blowgun', damage: '1 piercing', props: [ammunition, range(25, 100), loading], type: ranged },
		{ name: 'hand crossbow', damage: '1d6 piercing', props: [ammunition, range(30, 120), light, loading], type: ranged },
		{ name: 'heavy crossbow', damage: '1d10 piercing', props: [ammunition, range(100, 400), heavy, loading, twoHanded], type: ranged },
		{ name: 'longbow', damage: '1d8 piercing', props: [ammunition, range(150, 600), heavy, twoHanded], type: ranged },
		{ name: 'net', damage: '-', props: [thrown(5, 15), special('net')], type: ranged },
		{ name: 'yklwa', damage: '1d8 piercing', props: [thrown(10, 30)], type: melee },
		{ name: 'boomerang', damage: '1d4 bludgeoning', props: [range(60, 120)], type: ranged },
		{ name: 'unarmed strike', damage: '1 bludgeoning', props: ['-'], type: melee }
	]
	return weapon
}