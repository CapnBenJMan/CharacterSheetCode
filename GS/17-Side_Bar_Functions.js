/**
 * @param {GoogleAppsScript.Spreadsheet.Range} currentCell 
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss 
 * @param {string} sheetName 
 * @returns A1 Notation for currentCell's equivalent position in a page-layout storage sheet or currentCell's A1 Notation if not a part of a page-layout
 */
function getOuterRange(currentCell, ss, sheetName) {
	const iwr = { // (is within range) array
		weapons: isWithinRange(currentCell, ss.getRange('Character!R32:AF36')), // weapons range
		notes: isWithinRange(currentCell, ss.getRange('Character!R37:AF42')), // notes range
		lFeatures: isWithinRange(currentCell, ss.getRange('Character!Z45:AF56')), // left features range
		rFeatures: isWithinRange(currentCell, ss.getRange('Character!AH45:AN56')) // right features range
	}
	if (iwr.weapons.tf) { // if within weapons range
		const position = findPosition(ss.getRange('Character!T31').getValue(),
			'Notes',
			ss.getSheetByName('Weapons and Notes List'))
		// ^find position
		const cell = ss.getSheetByName('Weapons and Notes List')
			.getRange(position.row, position.col, 5, 15)
			.getCell(iwr.weapons.row, iwr.weapons.col)
			.getA1Notation()
		// ^get A1 notation for the found position
		return `'Weapons and Notes List'!${cell}` // return the A1 notation for the range
	} else if (iwr.notes.tf) { // if within notes range
		const position = findPosition(ss.getRange('Character!R43').getValue(),
			'Notes',
			ss.getSheetByName('Weapons and Notes List'))
		// ^find position
		const cell = ss.getSheetByName('Weapons and Notes List')
			.getRange(position.row, position.col, 6, 15)
			.getCell(iwr.notes.row, iwr.notes.col)
			.getA1Notation()
		// ^get A1 notation for the found position
		return `'Weapons and Notes List'!${cell}` // return A1 notation for the range
	} else if (iwr.lFeatures.tf || iwr.rFeatures.tf) { // if within features range
		const type = ss.getRange('Character!Z44').getValue() // simple/complex
		switch (type) { // switch between simple and complex
			case 'Simple': { // if simple
				const page = ss.getRange('Character!Z57').getValue()
				// ^get page number
				const position = findPosition(page, 'Simple', ss.getSheetByName('Simple Features List'))
				// ^get the position of the page in the features sheet
				const cell = ss.getSheetByName('Simple Features List')
					.getRange(position.row, position.col, 12, 15)
					.getCell(iwr.lFeatures.row, iwr.lFeatures.col).getA1Notation()
				// ^get the A1 notation of the page's reference
				return `'Simple Features List'!${cell}` // return the formatted A1 notation
			}
			case 'Complex': { // if complex
				const ptype = (iwr.lFeatures.tf) ? iwr.lFeatures : (iwr.rFeatures.tf) ? iwr.rFeatures : undefined
				// ^get the object that represents either the left or right side
				const range = (iwr.lFeatures.tf) ? 'Character!Z57' : (iwr.rFeatures.tf) ? 'Character!AH57' : undefined
				// ^get the A1 Notation based of the page cell based on left or right side selection
				const page = ss.getRange(range).getValue() // get the current page number
				const position = findPosition(page, 'Complex', ss.getSheetByName('Complex Features List'))
				// ^get the position object for the page
				const cell = ss.getSheetByName('Complex Features List')
					.getRange(position.row, position.col, 12, 7)
					.getCell(ptype.row, ptype.col).getA1Notation()
				// ^get the A1 notation of the page's reference
				return `'Complex Features List'!${cell}` // return the formatted A1 notation
			}
		}
	} else { // otherwise
		return `'${sheetName}'!${currentCell.getA1Notation()}` // return the A1 notation of the inputted cell
	}
}

/** Checks if the range subRange intersects in any way with searchRange
 * @param {GoogleAppsScript.Spreadsheet.Range} subRange 
 * @param {GoogleAppsScript.Spreadsheet.Range | GoogleAppsScript.Spreadsheet.Range[]} searchRange
 */
function isWithinRange(subRange, searchRange) {
	searchRange = [searchRange].flat(Infinity) // make sure that searchRange is a 1d array
	const subrangeA1 = subRange.getA1Notation() // get subrange's A1 notation
	const subRC = {
		start: A1toRowCol(subrangeA1.split(":")[0].toUpperCase()),
		end: A1toRowCol(subrangeA1.split(":")[1] ? subrangeA1.split(":")[1].toUpperCase() : subrangeA1.toUpperCase())
	} // get row/col objects for start and end positions of sub range

	for (let range of searchRange) { // loop through search ranges
		const rangeA1 = range.getA1Notation() // get A1 notation of current search range
		const rangeRC = {
			start: A1toRowCol(rangeA1.split(":")[0].toUpperCase()),
			end: A1toRowCol(rangeA1.split(":")[1] ? rangeA1.split(":")[1].toUpperCase() : rangeA1.toUpperCase())
		} // get row/col objects for start and end positions of current search range
		const
			left = subRC.end.col < rangeRC.start.col, // if sub range's end is to the left of search range's start
			right = subRC.start.col > rangeRC.end.col, // if sub range's start is to the right of search range's end
			above = subRC.end.row < rangeRC.start.row, // if sub range's end is above search range's start
			below = subRC.start.row > rangeRC.end.row // if sub range's start is below search range's end
		if (!(left || right || above || below)) { // if none of the above are true
			for (let i = subRC.start.col; i <= subRC.end.col; i++) { // loop through column
				for (let j = subRC.start.row; j <= subRC.end.row; j++) { // and loop through row
					if (rangeRC.start.col <= i && i <= rangeRC.end.col && rangeRC.start.row <= j && j <= rangeRC.end.row) {
						return { tf: true, row: j - rangeRC.start.row + 1, col: i - rangeRC.start.col + 1 }
						// ^return the first row/col combination that intersects
					}
				}
			}
		}
	}
	return { tf: false, row: 0, col: 0 } // otherwise, return an invalid combination and row/col values

	/** Converts the A1 notation of a to a row/col object
	 * @param {string} a */
	function A1toRowCol(a) {
		const b = a.split(/(\d+)/) // split a into letter (row) and number (col)
		return { // return the object
			row: A1toCol(b[0]),
			col: Number(b[1])
		}
	}
}

/** Returns the value of the current cell and sheet passed through getOuterRange */
function selection() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // active spreadsheet reference
	const currentCell = ss.getCurrentCell() // current cell
	const sheetName = currentCell.getSheet().getName() // sheet name
	return getOuterRange(currentCell, ss, sheetName) // return returned value from getOuterRange
}

/** Returns a boolean denoting if a sheet/cell combination exists
 * @param {string} sheet @param {string} cell */
function exists(sheet, cell) {
	try {
		const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet) // get the inputted sheet
		const lrow = s.getLastRow(), lcol = s.getLastColumn(), r = s.getRange(cell)
		// ^get the last row and column of the sheet, and define reference to range
		return s != null && (lrow <= r.getRow() && lcol <= r.getColumn())
		// ^returns if the sheet exists and if the range exists within the regular bounds of the sheet
	} catch {
		return false // returns false if an error occurs
	}
}

/** Used in the lookup dialog to get a website's html as a string
 * @param {string} url @returns {string} The HTML content of a website */
function returnFetch(url) {
	return UrlFetchApp.fetch(url).getContentText()
}

/** Opens an html dialog
 * @param {string} file */
function openHTML(file, titleOverride = '') {
	const ui = SpreadsheetApp.getUi()
	const fileInfo = [ // name: file name, width & height: container width/height + 50
		// ^^title: the title to be given the dialog, func: the type of dialog to be shown
		{ name: 'lookup', width: 650, height: 450, title: 'Lookup', func: ui.showModelessDialog },
		{ name: 'calculator', width: 500, height: 300, title: 'Coin Calculator', func: ui.showModalDialog },
		{ name: 'distributor', width: 300, height: 300, title: 'Coin Distributor', func: ui.showModalDialog },
		{ name: 'weapon', width: 425, height: 325, title: 'Weapon Selector', func: ui.showModalDialog },
		{ name: 'lrdialog', width: 400, height: 175, title: 'Long Rest Options', func: ui.showModalDialog },
		{ name: 'adjuster', width: 450, height: 250, title: 'Adjust Hit Dice', func: ui.showModalDialog },
		{ name: 'shortrest', width: 525, height: 200, title: 'Short Rest', func: ui.showModalDialog },
		{ name: 'armor', width: 475, height: 575, title: 'Armor Selector', func: ui.showModalDialog },
		{ name: 'diceroller', width: 620, height: 330, title: 'Dice Roller', func: ui.showModalDialog },
		{ name: 'level', width: 500, height: 300, title: 'Level Selector', func: ui.showModalDialog },
		{ name: 'editlevel', width: 350, height: 250, title: 'Add Level', func: ui.showModalDialog },
		{ name: 'formulas', width: 800, height: 425, title: 'Formula Library', func: ui.showModalDialog },
		{ name: 'hitdice', width: 450, height: 180, title: 'Hit Dice Override', func: ui.showModalDialog },
		{ name: 'equipment', width: 500, height: 450, title: 'Equipment Setter', func: ui.showModelessDialog },
		{ name: '', width: 0, height: 0, title: '', func: ui.showModalDialog } // template
	].find(x => x.name == file)
	fileInfo.func( // call the function to show the dialog
		HtmlService.createHtmlOutputFromFile(`HTML/${fileInfo.name}`) // create html output
			.setWidth(fileInfo.width).setHeight(fileInfo.height), // set width and height
		(titleOverride !== '') ? titleOverride : fileInfo.title) // set title
}