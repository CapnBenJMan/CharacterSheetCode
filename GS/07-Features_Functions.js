/**
 * @param {GoogleAppsScript.Spreadsheet.Range} start 
 * @param {GoogleAppsScript.Spreadsheet.Range} end 
 */
function formulaCopy(start, end) { // copy all aspects of start range to end range
	var forms = start.getFormulas() // get formulas
	var values = start.getValues()
		.map((x, i) => x.map((y, j) => forms[i][j] != '' ? forms[i][j] : y)) // get values
	var notes = start.getNotes() // get notes
	var vals = start.getDataValidations() // get data validations
	start.copyTo(end, { formatOnly: true }) // copy formatting
	end.setValues(values).setNotes(notes).setDataValidations(vals) // copy values, notes, and data validations
}

/**
 * @param {string | number} searchKey 
 * @param {"Simple"|"Complex"|"Weapons"|"Notes"} listType 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheetList 
 * @returns {{row: number, col: number} | undefined}
 */
function findPosition(searchKey, listType, sheetList) { // finds the row and column of a, returns an array [row, col]
	const obj = {
		'Simple': { range: sheetList.getRange('A1:AD39'), offset: 12 },
		'Complex': { range: sheetList.getRange('A1:U39'), offset: 12 },
		'Weapons': { range: sheetList.getRange('A1:AE30'), offset: 5 },
		'Notes': { range: sheetList.getRange('AJ1:BN28'), offset: 6 }
	}[listType]
	// ^number of columns in range, number of search columns, number of rows in range + 1, column offset (column number - 1)

	const found = obj.range.createTextFinder(searchKey)
	let found1 = found.findNext()
	while (found1.getRow() % (obj.offset + 1) != 0) found1 = found.findNext()
	return { row: found1.getRow() - obj.offset, col: found1.getColumn() }
}

function saveSimple() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define reference to active spreadsheet
	const sheetList = ss.getSheetByName("Simple Features List") // storage sheet for different attributes
	const start1 = ss.getRange('Character!Z45:AN56') // start for save
	const searchKey = ss.getRange('Character!Z57').getValue() // currently selected page
	const oldPos = findPosition(searchKey, "Simple", sheetList)
	const end1 = sheetList.getRange(oldPos.row, oldPos.col, 12, 15) // destination for save
	formulaCopy(start1, end1)
}

function loadSimple() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define reference to active spreadsheet
	const sheetList = ss.getSheetByName("Simple Features List") // storage sheet for different attributes
	const start1 = ss.getRange('Character!Z45:AN56') // destination for load
	const newPos = findPosition(ss.getRange('Character!Z57').getValue(), "Simple", sheetList)
	const start2 = sheetList.getRange(newPos.row, newPos.col, 12, 15) // start for load
	formulaCopy(start2, start1)
}

function saveComplex() {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define reference to active spreadsheet
	const sheetList = ss.getSheetByName("Complex Features List") // storage sheet for different attributes
	const range1 = ss.getRange('Character!Z45:AF56') // range for left column
	const pos1 = ss.getRange('Character!Z57') // range for left dropdown list
	const range2 = ss.getRange('Character!AH45:AN56') // range for right column
	const pos2 = ss.getRange('Character!AH57') // range for right dropdown list
	var oldPos = findPosition(pos1.getValue(), "Complex", sheetList)
	var newPos = findPosition(pos2.getValue(), "Complex", sheetList)
	const end1 = sheetList.getRange(oldPos.row, oldPos.col, 12, 7) // destination for left save
	const end2 = sheetList.getRange(newPos.row, newPos.col, 12, 7) // destination for right save
	formulaCopy(range1, end1)
	formulaCopy(range2, end2)
}

function loadComplex() {
	const ss = SpreadsheetApp.getActiveSpreadsheet()
	const sheetList = ss.getSheetByName("Complex Features List") // storage sheet for different attributes
	const start1 = ss.getRange('Character!Z45:AF56') // range for left column
	const start2 = ss.getRange('Character!AH45:AN56') // range for right column
	const oldPos = findPosition(ss.getRange('Character!Z57').getValue(), "Complex", sheetList)
	const newPos = findPosition(ss.getRange('Character!AH57').getValue(), "Complex", sheetList)
	const end1 = sheetList.getRange(oldPos.row, oldPos.col, 12, 7) // start for left load
	const end2 = sheetList.getRange(newPos.row, newPos.col, 12, 7) // start for right load
	formulaCopy(end1, start1)
	formulaCopy(end2, start2)
}