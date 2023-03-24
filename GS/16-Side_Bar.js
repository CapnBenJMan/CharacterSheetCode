function sideBar() { // opens sidebar and creates menu
	SpreadsheetApp.getUi()
		.createMenu('Sidebar')
		.addItem('(Re)Load Sidebar', 'CharacterSheetCode.sideBarLoader')
		.addItem('Long Rest', 'CharacterSheetCode.longRest')
		.addItem('Short Rest', 'CharacterSheetCode.shortRest')
		.addItem('Add Rest', 'CharacterSheetCode.addLongRest')
		.addItem('Remove Rest', 'CharacterSheetCode.removeLongRest')
		.addItem('Fix Broken Images', 'CharacterSheetCode.fixBrokenImages')
		.addToUi() // creates menu item in case user closes sidebar
	sideBarLoader() // opens sidebar
}
/** Opens the sidebar */
function sideBarLoader() { // opens sidebar
	var sb = HtmlService.createHtmlOutputFromFile('HTML/sidebar')
		.setTitle(`Automation Sidebar`) // constructs sidebar
	SpreadsheetApp.getUi().showSidebar(sb) // opens sidebar
}

/** Returns an array that contains the following in order:
 * * Current Health (number)
 * * Maximum Health (number)
 * * Temporary Health (number)
 * * Whether or not there is caster levels (boolean)
 * * ID of the current spreadsheet (string)
 * * Current version of the sheet/code (string)
 * * Bonus Health (number)
 */
function getCurrent() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // active spreadsheet reference
	const scVal = ss.getRangeByName('TotalSCLevels').getValue()	// number of spellcasting class levels
	const pmVal = ss.getRangeByName('TotalPMLevels').getValue()	// number of pact magic class levels
	const tf = (scVal > 0 || pmVal > 0) // whether or not there are any pact magic or spellcasting class levels
	const version = ss.getRange(`'Legal and How-To'!M4`).getValue() // the current version of the sheet/code
	const bonus = ss.getRange('Character!X17').getValue() || 0 // the current amount of bonus health (or 0 if empty)
	const healthVals = [ // values of each health type...
		ss.getRange('Character!R17').getValue(), // current health
		ss.getRange('Character!U16').getValue(), // max health
		ss.getRange('Character!R21').getValue() || 0 // temp health (0 if cell is empty)
	].map(x => Number(x)) // makes sure each element is an integer
	return [...healthVals, tf, ss.getId(), version, Number(bonus)] // self-explanatory
}

/** Takes in an object and sets the various health values based on its properties
 * @param {{cur: number, temp: number, bonus: number, readonly max: number}} HP */
function health(HP) { // current health, tempHP
	const ss = SpreadsheetApp.getActiveSpreadsheet()
	ss.getRange('Character!R17').setValue(HP.cur) // set current health to hpVal
	if (HP.temp == 0) ss.getRange('Character!R21').setValue('') // if tempHpVal is 0, set cell to empty string
	else ss.getRange('Character!R21').setValue(HP.temp) // otherwise, set cell to tempHpVal
	if (HP.bonus == 0) ss.getRange('Character!X17').setValue('') // if bonus hp is 0, set cell to empty string
	else ss.getRange('Character!X17').setValue(HP.bonus) // otherwise, set cell to bonusHpVal
}

/** Returns an object containing every saving throw and ability/skill check's modifiers */
function getStats() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const savingThrows = ss.getRange('Character!I17:I22').getValues().flat().map(x => Number(x)) // get saving throw modifiers
	const skillChecks = ss.getRange('Character!I25:I42').getValues().flat().map(x => Number(x)) // get skill check modifiers
	const { Str: sC, Dex: dC, Con: coC, Int: iC, Wis: wC, Cha: chC, Prof: pr } = ss.getNamedRanges()
		// ^get stat modifiers and proficiency bonus
		.filter(x => ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha', 'Prof'].some(y => y == x.getName()))
		// ^filter named ranges
		.reduce((obj, cur) => { // reduces filtered array
			obj[cur.getName()] = Number(cur.getRange().getValue()) // set a property of obj as the value of the current range
			return obj // return object
		}, {})
	/* 
	.forEach(nrange => {
		switch (nrange.getName()) {
			case 'Str':
				sC = nrange.getRange().getValue()
				break
			case 'Dex':
				dC = nrange.getRange().getValue()
				break
			case 'Con':
				coC = nrange.getRange().getValue()
				break
			case 'Int':
				iC = nrange.getRange().getValue()
				break
			case 'Wis':
				wC = nrange.getRange().getValue()
				break
			case 'Cha':
				chC = nrange.getRange().getValue()
				break
			case 'Prof':
				pr = nrange.getRange().getValue()
				break
		}
	}) */
	return { // return object containing all modifiers
		strSave: savingThrows[0],
		dexSave: savingThrows[1],
		conSave: savingThrows[2],
		intSave: savingThrows[3],
		wisSave: savingThrows[4],
		chaSave: savingThrows[5],
		strCheck: Number(sC),
		dexCheck: Number(dC),
		conCheck: Number(coC),
		intCheck: Number(iC),
		wisCheck: Number(wC),
		chaCheck: Number(chC),
		prof: Number(pr),
		init: Number(ss.getRange('Character!V12').getValue()),
		acrobaticsCheck: skillChecks[0],
		animalCheck: skillChecks[1],
		arcanaCheck: skillChecks[2],
		athleticsCheck: skillChecks[3],
		deceptionCheck: skillChecks[4],
		historyCheck: skillChecks[5],
		insightCheck: skillChecks[6],
		intimidationCheck: skillChecks[7],
		investigationCheck: skillChecks[8],
		medicineCheck: skillChecks[9],
		natureCheck: skillChecks[10],
		perceptionCheck: skillChecks[11],
		performanceCheck: skillChecks[12],
		persuasionCheck: skillChecks[13],
		religionCheck: skillChecks[14],
		sleightCheck: skillChecks[15],
		stealthCheck: skillChecks[16],
		survivalCheck: skillChecks[17]
	}
}

/** Returns the values of each spell slot type and level */
function getSpells() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const scVal = ss.getRangeByName('TotalSCLevels').getValue() // get spellcaster levels
	const pmVal = ss.getRangeByName('TotalPMLevels').getValue() // get pact magic levels
	const masterSpells = ss.getSheetByName('Master Spells') // define reference to Master Spells sheet
	const slotRangeNames = masterSpells.getNamedRanges().map(x => {
		return { name: x.getName(), range: x.getRange() }
	})
	// ^get the names of each named range on the Master Spells sheet
	const slotValues = { scLvl: Number(scVal), pmLvl: Number(pmVal) } // define object containing caster levels
	for (let x of slotRangeNames) // loop through range names
		if (!isEmptyish(x.range.getValue())) // if isEmptyish doesn't return true
			slotValues[x.name.replace(/Master|L|Slots/g, "").toLowerCase()] = // set new property to slotValues
				x.range.getValue() // ^^equal to the value of the range
	return slotValues // return slot values
}

/** Reduces a spell slot type of level n by 1
 * @param {number} n  @param {string} type */
function useSpellSlot(n, type) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const range = ss.getRangeByName(`Master${type.toUpperCase()}L${n}Slots`) // define reference to range
	const val = range.getValue() // get the value from the range
	if (val != 0) range.setValue(val - 1) // if val is not 0, reduce range's value by 1
}

/** Takes in an object containing the spell slot values for each type and level and sets them to the sheet
 * @param {{
 * sc1: {dis: boolean, val: number},
 * sc2: {dis: boolean, val: number},
 * sc3: {dis: boolean, val: number},
 * sc4: {dis: boolean, val: number},
 * sc5: {dis: boolean, val: number},
 * sc6: {dis: boolean, val: number},
 * sc7: {dis: boolean, val: number},
 * sc8: {dis: boolean, val: number},
 * sc9: {dis: boolean, val: number},
 * pm1: {dis: boolean, val: number},
 * pm2: {dis: boolean, val: number},
 * pm3: {dis: boolean, val: number},
 * pm4: {dis: boolean, val: number},
 * pm5: {dis: boolean, val: number},
 * pm6: {dis: boolean, val: number},
 * pm7: {dis: boolean, val: number},
 * pm8: {dis: boolean, val: number},
 * pm9: {dis: boolean, val: number}}} slots
 */
function setSpellSlots(slots) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	for (let a in slots) // loop through slots
		if (slots[a].dis) // if this is true
			ss.getRangeByName(`Master${a.toUpperCase().slice(0, 2)}L${a.slice(-1)}Slots`)
				.setValue(slots[a].val == 0 ? '' : slots[a].val) // set the value
}