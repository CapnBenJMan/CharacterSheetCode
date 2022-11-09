/** @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function weaponSwap(e) { // changes weapon pages
	if (e.range.getSheet().getName() == 'Character' && e.range.getA1Notation() == 'T31') {
		// if edited sheet is "Character" and edited range is T31
		const listType = 'Weapons' // define list type (used in findPosition)
		const start1 = e.source.getSheetByName('Character').getRange('R32:AF36') // define start range
		const sheetList = e.source.getSheetByName('Weapons and Notes List') // define storage sheet
		const oldPos = findPosition(e.oldValue, listType, sheetList) // find the position of the current page
		const newPos = findPosition(e.value, listType, sheetList) // find the position of the page you want to swap to
		const end1 = sheetList.getRange(oldPos.row, oldPos.col, 5, 15) // destination for save
		const start2 = sheetList.getRange(newPos.row, newPos.col, 5, 15) // start for load
		formulaCopy(start1, end1)
		formulaCopy(start2, start1)
	}
}

/** @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function notesSwap(e) { // changes notes pages
	if (e.range.getSheet().getName() == 'Character' && e.range.getA1Notation() == 'R43') {
		// if edited range is Character!R43
		const listType = 'Notes' // define list type (used in findPosition)
		const start1 = e.source.getSheetByName('Character').getRange('R37:AF42') // define start range
		const sheetList = e.source.getSheetByName('Weapons and Notes List') // define storage sheet
		const oldPos = findPosition(e.oldValue, listType, sheetList) // find position of initial page
		const newPos = findPosition(e.value, listType, sheetList) // find position of next page
		const end1 = sheetList.getRange(oldPos.row, oldPos.col, 6, 15) // destination for save
		const start2 = sheetList.getRange(newPos.row, newPos.col, 6, 15) // start for load
		formulaCopy(start1, end1)
		formulaCopy(start2, start1)
	}
}

function saveWeapons() { // saves current weapons page
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const sheetList = ss.getSheetByName("Weapons and Notes List") // storage sheet for different attributes
	const start1 = ss.getRange('Character!R32:AF36') // define start range
	const searchKey = ss.getRange('Character!T31').getValue() // define search key
	const oldPos = findPosition(searchKey, "Weapons", sheetList) // find position of initial range
	const end1 = sheetList.getRange(oldPos.row, oldPos.col, 5, 15) // destination for save
	formulaCopy(start1, end1)
}

function loadWeapons() { // loads current weapons page from storage
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const sheetList = ss.getSheetByName("Weapons and Notes List") // storage sheet for different attributes
	const start1 = ss.getRange('Character!R32:AF36') // destination for load
	const searchKey = ss.getRange('Character!T31').getValue() // define search key
	const newPos = findPosition(searchKey, "Weapons", sheetList) // find position of page
	const start2 = sheetList.getRange(newPos.row, newPos.col, 5, 15) // start for load
	formulaCopy(start2, start1)
}

function saveNotes() { // saves current notes page
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const sheetList = ss.getSheetByName("Weapons and Notes List") // storage sheet for different attributes
	const start1 = ss.getRange('Character!R37:AF42') // define start range
	const searchKey = ss.getRange('Character!R43').getValue() // define search key
	const oldPos = findPosition(searchKey, "Notes", sheetList) // find position of page
	const end1 = sheetList.getRange(oldPos.row, oldPos.col, 6, 15) // destination for save
	formulaCopy(start1, end1)
}

function loadNotes() { // loads current notes page
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const sheetList = ss.getSheetByName("Weapons and Notes List") // storage sheet for different attributes
	const start1 = ss.getRange('Character!R37:AF42') // define start range
	const searchKey = ss.getRange('Character!R43').getValue() // define search key
	const newPos = findPosition(searchKey, "Notes", sheetList) // find position of range
	const start2 = sheetList.getRange(newPos.row, newPos.col, 6, 15) // start for load
	formulaCopy(start2, start1)
}