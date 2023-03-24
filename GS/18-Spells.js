/** Autofills a cell's note with the propper spell description
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function spells(e) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // active spreadsheet reference
	const eSheetName = e.range.getSheet().getName() // the name of the current spell sheet
	const spls = ss.getNamedRanges()
		.filter(x => x.getName().includes('Slots') && x.getRange().getSheet().getName() == eSheetName)
		.map(x => x.getRange()) // gets each named range for the sheet that includes 'Slots' and map their ranges
	if (eSheetName == 'Master Spells') return // guard clause
	if (eSheetName.includes("Spells") && isEmptyish(e.value)) { // if edited range is empty
		e.range.clearNote() // clear note
	} else if (e.range.getRow() > 9 && !isWithinRange(e.range, spls).tf) {
		// ^if edited row is greater than 9 and edited range is not within a named range
		if (eSheetName.includes("Spells") && !isEmptyish(e.value) && e.value.length >= 3) {
			const url = `http://dnd5e.wikidot.com/spell:${e.value.replace(/'/g, '').replace(/\/| /g, '-')}`
			// ^define formatted url
			try {
				setSpell(url) // try to set the note with the current url
			} catch {
				try {
					setSpell(url + '-ua')
					// ^try to set the note with the current url with '-ua' if the previous attempt failed
				} catch {
					e.range.setNote( // set a note alerting the user of a failure
						`Operation Failed.\n` +
						`Please make sure you typed the name correctly and that the spell you entered is not a homebrew spell`
					)
				}
			}
		}
	} else if (isWithinRange(e.range, spls).tf) { // if user tried to edit a spell value
		SpreadsheetApp.getUi().alert('Please do not try to edit this value.') // alert user of error
		const name = e.range.getSheet().getNamedRanges() // get the slot type for the edited named range
			.find(x => isWithinRange(e.range, [x.getRange()]).tf).getName().slice(-9)
		if (false) ss.getRangeByName(`Master${name}`).setValue(e.value) // something that might be implemented in the future
		e.range.setFormula(`=Master${name}`) // reset edited range's formula to original value
	}
	/** Takes the url and sets
	 * @param {string} url */
	function setSpell(url) {
		const raw = UrlFetchApp.fetch(url).getContentText() // raw input from website
		const refine = raw.substring(raw.indexOf('<p>Source:'), raw.indexOf('Spell Lists')) // the part we want
			.replace(/<li>/g, ' - ') // formats all list elements
			.replace(/<(?:.|\n)*?>/g, "") // removes all html elements
			.replace(/Source:.+\n/, "")
			.replace(/\n\n\n/g, '\n') // removes first line from refine
		e.range.setNote(refine) // sets the note to the final refined product
		const reformat = e.value + // define this variable to be the name of the spell plus any ritual/concentration tags
			(refine.match(/-level .+ \(ritual\)/) != null ? " (R)" : '') + // if the spell is a ritual
			(refine.match(/Duration: Concentration,/) != null ? " (C)" : '') // if the spell is concentration
		if (reformat != e.value) e.range.setValue(reformat.replace(" (R) (C)", " (R,C)"))
		// ^set the cell's value to the newly parsed reformatted value if reformat is different than the original value
	}
}