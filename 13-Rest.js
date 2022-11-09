/** This function handles the execution of the long rest code */
function longRest() {
	var curr = 'Save Weapons' // variable for stopStart timelogging
	let stopStart = x => { // arrow function to keep track of execution time in the logger
		console.timeEnd(curr) // end current timer
		console.time(x) // start new timer
		curr = x // set current to x
	}
	console.log("Long Rest Start") // log start of execution
	console.time(curr) // begin first timer
	saveWeapons() // save weapons
	stopStart("Save Notes") // start timer for notes
	saveNotes() // save notes
	stopStart("Save Features") // start timer for features
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	switch (ss.getRange('Character!Z44').getValue()) { // save simple or complex depending on selection
		case 'Simple':
			saveSimple()
			break
		case 'Complex':
			saveComplex()
			break
	}
	stopStart("References") // start timer for references
	const mhp = ss.getRange('Character!U16').getValue() // max health value
	const chp = ss.getRange('Character!R17') // current health range
	const thp = ss.getRange('Character!R21') // tempHP range
	const masterSpells = ss.getSheetByName('Master Spells') // reference to master spells sheet
	const curSpells = masterSpells.getRange('X3:AA20') // reference to current spell slots range
	const maxSpells = masterSpells.getRange('AB3:AE20').getValues() // get the values of the max spell slots
	stopStart("Resetting") // start timer for resetting health values
	chp.setValue(mhp) // set current health to max health
	thp.setValue('') // set tempHP to empty string
	curSpells.setValues(maxSpells) // set each spell slot range to empty string
	stopStart("Hit Dice") // start timer for hit dice adjuster
	adjustHitDice(ss) // run hit dice adjuster
	stopStart("Rest Runner") // start timer for rest runner
	restRunner('long') // run long rest
	sideBarLoader() // reload sidebar
	console.timeEnd(curr) // end timer
}

/** This function handles the execution for the short rest code */
function shortRest() {
	saveWeapons() // save weapons
	saveNotes() // save notes
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	switch (ss.getRange('Character!Z44').getValue()) { // save simple or complex depending on selection
		case 'Simple':
			saveSimple()
			break
		case 'Complex':
			saveComplex()
			break
	}
	if (ss.getRange(`Character!AQ6:AT6`).getValues().flat().some(x => Number(x) > 0)) openHTML('shortrest')
	// ^if the character has hit dice left to be used, open short rest dialog
	const spls = ss.getNamedRanges().filter(x => x.getName().includes('Slots') &&
		x.getName().includes('MasterPM') &&
		numRange(1, 5).some(y => x.getName().includes(y)))
		.map(x => x.getRange())
	// ^array of Pact Magic spell slots
	const masterSpells = ss.getSheetByName('Master Spells') // define reference to master spells sheet
	const splsVals = spls.map(x => masterSpells.getRange(x.getRow(), x.getColumn() + 4).getValue())
	// ^map max pact magic spells values
	for (let x in spls) spls[x].setValue(splsVals[x]) // set PM ranges to their max values (reset them to full)
	restRunner('short') // run short rest
	sideBarLoader() // reload sidebar
}

/** This function opens the dialog to add a rest rule to the sheet */
function addLongRest() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const ui = SpreadsheetApp.getUi() // define ui reference
	const currentCell = ss.getCurrentCell() // get current cell
	const sheet = currentCell.getSheet().getName() // get current cell's sheet name
	if (sheet != 'Rest List') { // if current cell's sheet is not rest list
		const rangeP = getOuterRange(currentCell, ss, sheet) // define rangeP as return of getOuterRange
		const restListSheet = ss.getSheetByName('Rest List') // define reference to Rest List sheet
		const lastRow = restListSheet.getLastRow() // define lastRow as the last row of Rest List
		const ranges = ss.getSheetByName('Rest List').getRange(1, 1, lastRow + 1, 1).getValues() // define ranges as the saved rest ranges
		if (!ranges.flat().includes(rangeP)) openHTML('lrdialog') // if ranges doesn't include rangeP, show the dialog
		else if (ranges.flat().includes(rangeP)) { // else if it does include rangeP
			var yn = ui.alert(
				'Warning: the cell you wish to format already has a rule set to it. ' +
				'Proceeding will overwrite this rule.\n' +
				'Do you wish to proceed?',
				ui.ButtonSet.OK_CANCEL) // alert user of existing rule on cell
			if (yn == ui.Button.OK) openHTML('lrdialog') // if user pressed okay button show dialog
		}
	} else ui.alert('Do not try to add a long rest here.') // otherwise alert user of restriction
}

/** This function removes a rest rule from the sheet */
function removeLongRest() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const currentCell = ss.getCurrentCell() // get current cell
	const sheet = currentCell.getSheet().getName() // get current cell's sheet name
	const rangeP = getOuterRange(currentCell, ss, sheet) // get outer range
	const restListSheet = ss.getSheetByName('Rest List') // define lri as rest list sheet
	const lastRow = restListSheet.getLastRow() // define last row as last row of rest list
	const ranges = ss.getSheetByName('Rest List').getRange(1, 1, lastRow + 1, 1).getValues().flat() // define ranges as the saved rest ranges
	if (ranges.includes(rangeP)) { // if ranges includes rangeP
		const ui = SpreadsheetApp.getUi() // define ui reference
		const res = ui.alert('Are you sure you want to proceed?', ui.ButtonSet.OK_CANCEL) // ask for confirmation
		if (res == ui.Button.OK) { // if button selection is okay
			if (lastRow == 1) restListSheet.getRange(1, 1, 1, restListSheet.getLastColumn()).clearContent()
			// ^clear row content if last row is 1
			else if (lastRow > 1) restListSheet.deleteRow(ranges.indexOf(rangeP) + 1)
			// ^else if last row is greater than 1 delete that row
		}
	} else { // otherwise
		ui.alert(`Error: You don't appear to have any rest rules applied to this cell`) // alert user of error
	}
}

/** This function adjusts the number of expended hit dice. 
 * If less than half the total remains, opends a dialog asking for manual adjustment
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss */
function adjustHitDice(ss) {
	const hitDiceRange = ss.getRange('Character!AQ4:AT4') // define reference to max hit dice range
	const expendedRange = ss.getRange('Character!AQ6:AT6') // define reference to current hit dice range
	const hitDiceVals = hitDiceRange.getValues() // get the values of the max range
	const expendedVals = expendedRange.getValues() // get the values of the current range
	/** @type {number} */ const numHitDice = hitDiceVals[0].reduce((total, val) => total + Number(val), 0)
	// ^defines the total number of hit dice a character can gain
	/** @type {number} */ const numExpended = expendedVals[0].reduce((total, val) => total + Number(val), 0)
	// ^defines the total number of expended hit dice a character has
	if ((numExpended || 1) >= Math.ceil(numHitDice / 2)) expendedRange.setValues(hitDiceVals)
	// ^if number of expended hit dice (or 1) is greater than or equal to half of the total number of hit dice (rounded up)
	// ^^set expended hit dice to their respective maxxes
	else { // otherwise
		var numZero = 0, pos = 0 // define numZero and pos
		hitDiceVals[0].forEach((x, i) => { // loop through hitDiceVals
			if (Number(x) == 0) numZero++ // if x is 0, increment numZero
			else pos = i // otherwise, set pos to i
		})
		if (numZero == 3) { // if there is only 1 type of hit die available
			const current = Number(expendedVals[0][pos]), // get current hit dice total
				max = Number(hitDiceVals[0][pos]) // and get its respective max
			expendedRange.getCell(1, pos + 1).setValue(Math.min(max, current + Math.ceil(max / 2)))
			// ^update the expended hitDie value, making sure that the value can't exceed the max
		} else openHTML('adjuster') // otherwise open adjuster dialog
	}
}

function getHitDice() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	/** @param {string} r @returns {number} Cell Value */
	let val = r => Number(ss.getRange(r).getValue()) // arrow function to get value of a range and return it as a number
	return { // returns an object containing the max and expended values of each die type, and their max replacement value
		maxd6: val('Character!AQ4'),
		maxd8: val('Character!AR4'),
		maxd10: val('Character!AS4'),
		maxd12: val('Character!AT4'),
		expendedd6: val('Character!AQ6'),
		expendedd8: val('Character!AR6'),
		expendedd10: val('Character!AS6'),
		expendedd12: val('Character!AT6'),
		get maxReplacement() { return Math.max(Math.floor((this.maxd6 + this.maxd8 + this.maxd10 + this.maxd12) / 2), 1) }
	}
}

/**
 * @param {number} d6 
 * @param {number} d8 
 * @param {number} d10 
 * @param {number} d12 
 * @param {boolean} bool 
 * @param {number} plus
 * @param {any[]} initial
 */
function updateHitDice(d6 = 0, d8 = 0, d10 = 0, d12 = 0, bool = false, plus = 0, initial = []) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	/** @param {string} range */
	let setVal = (range, value) => ss.getRange(range).setValue(value) // arrow function to set a value to a specific range
	for (let range of [['Character!AQ6', d6], ['Character!AR6', d8], ['Character!AS6', d10], ['Character!AT6', d12]])
		setVal(range[0], range[1]) // loop through each range and set their associated value
	if (bool) { // if bool is set to true
		const conMultiplier = initial.reduce((total, x) => total += x, 0) // calculate con multiplier
		const tempHpVal = Number(ss.getRange("Character!R21").getValue()) // define t = temphp value
		const currentHpVal = Math.min(
			Math.max(Number(ss.getRange("Character!R17").getValue()) + 
			// ^defines currentHpVal as either
				Number(plus) + (conMultiplier * Number(ss.getRangeByName('Con').getValue())), 0), 
			// ^^the currentHP plus rolled total plus con modifiers
			Number(ss.getRange('Character!U16').getValue())) 
			// ^^or the maximum health value
		health(currentHpVal, tempHpVal) // set health
		sideBarLoader() // reload sidebar
	}
}