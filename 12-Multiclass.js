/** Returns an object that contains an array of class names and the total level */
function getLevels() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const classes = ss.getRange('Character!AQ7:AQ26') // get levels storage range
		.getValues() // get their values
		.map(x => x[0]) // get each value in the first column
		.filter(x => !isEmptyish(x)) // filter out any blank values
	return { arr: classes, lvl: Number(ss.getRangeByName('Lvl').getValue()) }
	// ^return an object containing the classes and the total level
}

/** Sets buffer range to selection and opens editlevel dialog
 * @param {string} selection */
function levelBuffer(selection) { // 
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	ss.getRange('Character!AS1').setValue(selection) // set buffer range to selection
	openHTML('editlevel', (['addlevel', 'add'].some(x => x == selection)) ? 'Add Level' : selection)
	// ^open dialog with variable title
}

function getClassEdit() { // returns value in the level buffer
	return SpreadsheetApp.getActiveSpreadsheet().getRange('Character!AS1').getValue()
}

function clearClassEdit() { // clears the level buffer range
	SpreadsheetApp.getActiveSpreadsheet().getRange('Character!AS1').setValue('')
}

function getClassInfo() { // returns level info
	const ss = SpreadsheetApp.getActiveSpreadsheet() // Spreadsheet reference
	var current = getClassEdit() // get level buffer value
	const classRange = ss.getRange('Character!AQ7:AU26') // class storage range reference
	const absLvl = Number(ss.getRangeByName('TotalCharacterLevels').getValue())
	// ^define total character level
	let cell = (row, col) => classRange.getCell(row, col).getValue()
	// ^arrow function to return value of certain cell in classRange
	if (['add', 'addlevel'].some(x => x == current)) { // if current is either 'add' or 'addlevel'
		for (let i = 1; i <= classRange.getNumRows(); i++) { // loop through classRange rows
			if (classRange.getCell(i, 1).isBlank()) { // if the current range is blank
				return { arr: ['add', i], lvl: absLvl } // return array and level
			}
		}
	} else { // otherwise (for an edit)
		for (let i = 1; i <= classRange.getNumRows(); i++) { // loop through classRange
			if (classRange.getCell(i, 1).getValue() == current) {
				// ^if current is the same as the value of the first column
				const info = { // define info object that contains
					class: cell(i, 1), // the class name
					subclass: cell(i, 2), // the subclass name
					level: cell(i, 3), // the number of levels in that class
					hitdie: cell(i, 4), // the hitdie of the class
					spells: cell(i, 5) // the spellcasting type of the class
				}
				return { arr: ['edit', i, info], lvl: absLvl } // return array and level
			}
		}
	}
}

/** Saves the inputted class info
 * @param {string} className 
 * @param {string} subclass 
 * @param {number|string} level 
 * @param {number|string} hitdie 
 * @param {string} spells 
 * @param {number} x 
 * @param {string} [selection] 
 */
function addEditInfo(className, subclass, level, hitdie, spells, x, selection) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // Spreadsheet reference
	const classValues = ss.getRange('Character!AQ7:AQ26').getValues().flat() // get array of class names
	const classRange = ss.getRange('Character!AQ7:AU26') // define reference to class storage range
	const info = [className, subclass, level, hitdie, spells] // define array of inputted parameters
	if (selection == 'add' && checkDuplicate(className)) { // if user is adding a class that already exists
		SpreadsheetApp.getUi().alert('Error: You cannot take separate levels in a class you already have levels in.\n' +
			'Please change your input.') // alert user of an error
		levelBuffer(selection) // save selection to buffer
		return // end execution
	} else { // otherwise
		const cell = classRange.getCell(x, i + 1) // define reference to cell
		ss.getSheetByName('Character').getRange(cell.getRow(), cell.getColumn(), 1, 5).setValues([info])
		// ^set values of row in class storage to the contents of info
	}
	rearranger() // rearranges class rows to always be as close to the top as possible (when deleting a class)
	clearClassEdit() // self explanatory
	adjustNamedRanges(ss) // makes sure each level has a named range
	if (spells != 'None') doSpells(ss, className, subclass, spells)
	// ^creates a spells sheet for the class if the new class is a caster class
	adjustNote(ss) // adjusts the note that shows the named range for each class
	adjustExpended(ss) // makes sure that the current hit dice values never exceed their equivalent maxes
	sideBarLoader() // reloads sidebar

	/** 
	 * Checks if the class being added is already in the class list
	 * @param {string} name */
	function checkDuplicate(name) {
		for (a of classValues) { // loop through classValues
			if (name.toLowerCase().replace(/ /g, "") == a.toLowerCase().replace(/ /g, "")) return true
			// ^if name is in classValues, return true
		}
		return false // otherwise, return false
	}

	/** Sorts classes so that there are no empty rows */
	function rearranger() {
		const sheet = ss.getSheetByName('Character') // define Character sheet reference
		const range = sheet.getRange('AQ7:AU26') // define reference to class storage range
		var i = 1, j = 1, rows = 20 // define 
		while (i < rows && j < rows) { // while i and j are less than rows
			const control = { // define control object with cell, row, and column
				cell: range.getCell(i, 1),
				get row() { return Number(this.cell.getRow()) },
				get col() { return Number(this.cell.getColumn()) }
			}
			if (control.cell.isBlank()) { // if control cell is blank
				const vals = sheet.getRange(control.row + 1, control.col, rows - i, 5).getValues()
				// ^get the values of the rows below the control row
				sheet.getRange(control.row, control.col, rows - i, 5).setValues(vals)
				// ^moves the values up 1 row
				sheet.getRange(control.row + rows - i, control.col, 1, 5).clearContent()
				// ^clears the last row(s)
				j++ // increments j
			} else { // otherwise
				i++ // increment i
				j++ // increment j
			}
		}
	}
}

/** Adjusts current hit dice values so that they are never greater than their respective max values 
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss */
function adjustExpended(ss) {
	const count = ss.getRange('Character!AQ4:AT4') // define reference to max hit dice range
	const current = ss.getRange('Character!AQ6:AT6') // define reference to current hit dice range
	let cell = (range, row, col) => Number(range.getCell(row, col).getValue())
	// ^arrow function to return the value of the range inputted
	for (i = 1; i <= 4; i++) { // loop through each column
		if (cell(current, 1, i) > cell(count, 1, i)) current.getCell(1, i).setValue(cell(count, 1, i))
		// ^set current value to its equivalent max if current is greater than the max
	}
}

/** Adjusts the note on the classes cell that contains the named ranges for each level
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss */
function adjustNote(ss) {
	const classRange = ss.getRange('Character!T5') // define reference to class display cell
	const note = classRange.getNote() // get the current note in that cell
	const classes = ss.getRange('Character!AQ7:AS26') // define reference to class storage range
	/** @type {string[]} */
	const className = [], subclass = [], level = [] // create a series of empty arrays for classNames, subclasses, and levels
	for (let i = 1; i <= classes.getNumRows(); i++) { // loop through class range rows
		let cell = (row, col) => classes.getCell(row, col) // arrow function to return specific cell of class range
		if (!cell(i, 1).isBlank()) { // if the first column of the first row is not blank
			className.push(cell(i, 1).getValue()) // push class, subclass and level of the row to their respective arrays
			subclass.push(cell(i, 2).getValue()) // ^^^
			level.push(cell(i, 3).getValue()) // ^^^
		}
	}
	const noteBuilder = className.reduce((str, x, j) => str +
		`${subclass[j]} ${x} ${level[j]} (${className[j].replace(/ /g, "")}Lvl)`.trim() +
		((j + 1 < className.length) ? '\n' : ''),
		'To reference a level in a formula, use the value in parentheses\n')
	// ^define noteBuilder as the reduced className array that becomes
	// ^a note containing the named ranges associated to their class levels
	if (note != noteBuilder) classRange.setNote(noteBuilder)
	// ^if the note builder is different than the original note, update the class cell's note
}

/** Adds or removes named ranges depending on whether a class was added or removed
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss */
function adjustNamedRanges(ss) {
	const classes = ss.getRange('Character!AQ7:AS26') // defines reference to class storage range
	for (let i = 1; i <= classes.getNumRows(); i++) { // loop through class range
		const current = classes.getCell(i, 1).getValue().replace(/ /g, "") // value of current row's class name without spaces
		if (ss.getRangeByName(`${current}Lvl`) == null && !isEmptyish(current)) ss.setNamedRange(`${current}Lvl`, classes.getCell(i, 3))
		// ^sets new named range if it doesn't already exist and current is not an empty string
	}
	const lvlRanges = ss.getNamedRanges().filter(elem => elem.getName().includes("Lvl") && elem.getName() != "Lvl")
	// ^defines an array of named ranges whose names include the string 'Lvl' but are not equal to 'Lvl'
	for (a in lvlRanges) { // loop through lvlRanges
		const row = lvlRanges[a].getRange().getRow() - 6
		// ^get the row (relative to the range to be used in getCell) of the current named range
		if (classes.getCell(row, 1).isBlank()) lvlRanges[a].remove()
		// ^remove the current named range if the first column of the current row is blank
		const param1 = classes.getCell(row, 1).getValue().replace(/ /g, "")
		// ^get the value of the first column of the current row and remove all spaces
		const param2 = lvlRanges[a].getName().replace("Lvl", "")
		// ^get the name of the current range and remove the string 'Lvl'
		if (param1 != param2) lvlRanges[a].remove()
		// remove the current named range if params 1 and 2 are not equal
	}
}

/** Creates a new spells sheet or modifies an existing spells sheet to account
 * for the addition of a new caster class
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss 
 * @param {string} Class
 * @param {string} Subclass
 * @param {string} spells
 */
function doSpells(ss, Class, Subclass, spells) {
	if (Class == "") return // ends execution if className is blank
	const sheetNames = ss.getSheets().map(x => x.getName()) // get all sheets and create an array containing their names
	/** Class name without spaces */
	const classWOSpaces = Class.replace(/ /g, "") // define a version of the class name without spaces
	if (spells != 'None') // if the class's caster type is not 'None'
		if (!sheetNames.includes(`${Class} Spells`)) {
			// ^if sheetNames does not include a spells sheet for the inputted class
			const master = spells == "Pact" ? 'PM' : 'SC'
			// ^if class's caster type is 'Pact', this equals 'PM' (Pact Magic), otherwise it equals 'SC' (Spellcasting)
			const newSheet = ss.getSheetByName('Template Spells').copyTo(ss).showSheet()
			// ^creates a copy of template spells and unhides it
			newSheet.setName(`${Class} Spells`) // renames the new sheet
			newSheet.getRange("AV38").setFormula(`=${classWOSpaces}Lvl`) // sets the sheet's caster level range to the proper value
			const protections = ss.getSheetByName('Template Spells').getProtections(SpreadsheetApp.ProtectionType.RANGE)
			// ^get the range protections from template spells
			for (let protection of protections) newSheet.getRange(protection.getRange().getA1Notation()).protect().setWarningOnly(true)
			// ^loop through protections and set each of them to the new sheet
			const casters = newSheet.getRange('AQ28:AQ').getValues().flat() // get the list of casters
			if (casters.includes(Class)) newSheet.getRange('C5').setValue(Class)
			// ^if the list of casters includes the inputted class, set the dropdown list's value to the class name
			else if (casters.includes(Subclass)) newSheet.getRange('C5').setValue(Subclass)
			// ^else if the list of casters includes the inputted subclass, set the dropdown list's value to the subclass name
			else newSheet.getRange("C5").setValue(spells) // otherwise, set the dropdown list's value to the caster type
			const newNamedRanges = newSheet.getNamedRanges() // gets the named ranges from the new sheet
			const spellLevels = numRange(1, 9) // define array of numbers for available spell levels
			for (let range of newNamedRanges) { // loop through named ranges
				const name = range.getName() // get name of current range
				if (spellLevels.some(x => name.includes(`L${x}`))) range.setName(`${classWOSpaces}${master}L${i + 1}Slots`)
				// ^if range references a spell slot area, set the name to the class name + the slot type + the level
				else if (name.includes('CasterLevel')) range.setName(`${classWOSpaces}CasterLevel`)
				// ^else if range references the caster level, add the class name to the range's name
			}
			for (let i of spellLevels) { // loop through spellLevels
				ss.getRangeByName(`'${Class} Spells'!${classWOSpaces}${master}L${i}Slots`).setFormula(`=Master${master}L${i}Slots`)
				// ^get each of the spell slot ranges and sets the formula to its equivalent range in the master sheet
			}
		} else { // otherwise (this is just if a user removes a class and then adds it again later)
			ss.getSheetByName(`${Class} Spells`) // get the class's spell sheet
				.getNamedRanges().find(x => x.getName().includes('CasterLevel')) // get the caster level named range
				.getRange().setFormula(`=${classWOSpaces}Lvl`) // set its formula to the class's level
		}
}