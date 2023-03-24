/** @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function features(e) {
	var sc = e.source.getRange('Character!Z44').getValue() // value of the simple/complex selector
	if (e.range.getA1Notation() == 'Z44') { // if the edited range is Character!Z44...
		featureChange(e) // ...change the mode
		return
	}
	if (sc == "Complex") { // if set to complex mode...
		complexFeatures(e) // ...run complex mode function to switch pages
	} else if (sc == "Simple") { // if set to simple mode...
		simpleFeatures(e) // ...run simple mode function to switch pages
	}
}

/** @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function complexFeatures(e) { // complex features changer
	if ((e.range.getA1Notation() === 'Z57' || e.range.getA1Notation() === 'AH57') && e.range.getSheet().getName() === 'Character') {
		// ^if edited range is Z57 or AH57 and edited range is within sheet Character...
		if (e.source.getRange('Character!Z57').getValue() == e.source.getRange('Character!AH57').getValue()) {
			// ^...if both lists are set to the same thing...
			SpreadsheetApp.getUi().alert('You cannot display the same list twice.\nPlease select a different list.')
			// ^...alert user of error
			e.range.setValue(e.oldValue) // ...and set edited range to its original value
		} else { // ...otherwise...
			const listType = "Complex" // define const x = "Complex" (used in findPosition)
			const sheetList = e.source.getSheetByName("Complex Features List")
			// ^storage sheet for different attributes
			const range1 = e.source.getRange('Character!Z45:AF56') // range for left column
			const pos1 = e.source.getRange('Character!Z57') // range for left dropdown list
			const range2 = e.source.getRange('Character!AH45:AN56') // range for right column
			const pos2 = e.source.getRange('Character!AH57') // range for right dropdown list
			var start1 // define var start1
			const oldPos = findPosition(e.oldValue, listType, sheetList)
			// ^define oldPos as return value of findPosition for oldValue
			const newPos = findPosition(e.value, listType, sheetList)
			// ^define newPos as return value of findPosition for value
			const end1 = sheetList.getRange(oldPos.row, oldPos.col, 12, 7) // destination for save
			const start2 = sheetList.getRange(newPos.row, newPos.col, 12, 7) // start for load

			if (e.range.getA1Notation() == pos1.getA1Notation()) { // if edited range is for the left column...
				start1 = range1 // acts as start for save and end for load
				formulaCopy(start1, end1)
				formulaCopy(start2, start1)
			} else if (e.range.getA1Notation() == pos2.getA1Notation()) {
				// ^if edited range is for the right column
				start1 = range2
				formulaCopy(start1, end1)
				formulaCopy(start2, start1)
			}
		}
	}
}

/** @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function simpleFeatures(e) { // simple features changer
	if (e.range.getA1Notation() === 'Z57' && e.range.getSheet().getName() === 'Character') { // if range is Character!Z57
		const listType = "Simple" // define listType = "Simple" (used in findPosition)
		const sheetList = e.source.getSheetByName("Simple Features List") // storage sheet for different attributes
		const start1 = e.source.getRange('Character!Z45:AN56') // define start1 as start for save and end for load
		const oldPos = findPosition(e.oldValue, listType, sheetList)
		// ^define oldPos as return value of findPosition for oldValue
		const newPos = findPosition(e.value, listType, sheetList)
		// ^define newPos as return value of findPosition for value
		const end1 = sheetList.getRange(oldPos.row, oldPos.col, 12, 15) // destination for save
		const start2 = sheetList.getRange(newPos.row, newPos.col, 12, 15) // start for load
		formulaCopy(start1, end1)
		formulaCopy(start2, start1)
	}
}

/** @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function featureChange(e) { // feature change
	var ui = SpreadsheetApp.getUi() // define reference to Spreadsheet Ui
	var response = ui.alert('Are you sure you want to continue?\nIf you have features in one layout, it will take some work to transfer them to the other one.', ui.ButtonSet.OK_CANCEL) // ask for confirmation before continuing
	const ss = e.source // define ss as the spreadsheet
	const dropdownPageRanges = ['Character!Z57:AF57', 'Character!AH57:AN57', 'AG57']
	// left column list range, right column list range, the cell between the two
	const ranges = ss.getRangeList(dropdownPageRanges) // get a range list from the ranges defined above
	const range = [ss.getRange(dropdownPageRanges[0]), ss.getRange(dropdownPageRanges[1])]
	// ^set range array to left and right column ranges
	const cRange = ss.getSheetByName('Complex Features List').getRange('V1:AA13')
	// ^get the range of each list item for complex
	const sRange = ss.getSheetByName('Simple Features List').getRange('AE1:AJ13')
	// ^get the range of each list item for simple
	const rangeFull = ss.getRange('Character!Z57:AN57') // get the full range for the dropdown selector
	var ruleC = SpreadsheetApp.newDataValidation() // complex data validation rule
		.requireValueInRange(cRange)
		.setAllowInvalid(false)
		.build()
	var ruleS = SpreadsheetApp.newDataValidation() // simple data validation rule
		.requireValueInRange(sRange)
		.setAllowInvalid(false)
		.build()
	if (response == ui.Button.OK) { // if user pressed okay...
		if (e.value == "Simple") { // from complex to simple
			saveComplex() // ...save complex
			ranges.clearContent().clearDataValidations()
			// ^...clear content and data validations for dropdown selectors
			rangeFull.breakApart() // ...unmerge dropdown selectors
			rangeFull.merge() // ...merge it together into a single selector
			rangeFull.setDataValidation(ruleS).setValue("FEATURES & TRAITS 1")
			// ^...set validations and set its value to the first element on the list
			loadSimple() // ...load simple
		} else if (e.value == "Complex") { // from simple to complex
			saveSimple() // ...save simple
			ranges.clearContent().clearDataValidations()
			// ^...clear content and data validations for dropdown selectors
			rangeFull.breakApart() // ...unmerge dropdown selectors
			range[0].merge() // ...create left dropdown selector
			range[1].merge() // ...and right one
			range[0].setDataValidation(ruleC).setValue("CLASS FEATURES 1")
			// ^...set validations and set its value to an element on the list
			range[1].setDataValidation(ruleC).setValue("SUBCLASS FEATURES 1")
			// ^...set validations and set its value to an element on the list
			loadComplex() // ...load complex
		}
	} else if (response == ui.Button.CANCEL) { // ...otherwise if user pressed cancel...
		e.range.setValue(e.oldValue) // ...set selector to its old value
	}
}