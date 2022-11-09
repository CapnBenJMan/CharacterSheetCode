/** This function runs a short or long rest, handling which rules are 
 * @param {"long"|"short"} type */
// range[0] | title[1] | type[2] | args[3] | LR bool[4] | SR bool[5] // each element corresponds to a column
function restRunner(type) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const ui = SpreadsheetApp.getUi() // define UI reference
	const sheet = ss.getSheetByName('Rest List') // define reference to Rest List sheet
	if (sheet.getLastRow() == 0) return // end execution if there are no entries
	const ranges = sheet.getRange(1, 1, sheet.getLastRow(), 6) // get the range that contains the rest rules
	const index = type == 'long' ? 4 : 5 // define the range to be filtered
	const refRanges = ranges.getValues().filter(y => y[index] == true) // filter out ranges that are triggered on a short vs long rest
	for (let i of refRanges) { // loop through filtered ranges
		switch (i[2]) {
			case 'current': // case for the current cell to be set to its current value
			case 'cell': // case for the current cell to be set to the value of a cell reference
			case 'other': // case for the current cell to be set to a value inputted beforehand by the user
			case 'randomnum': // case for the current cell to be set to a random value inputted beforehand by the user
				staticRunner(i[0], i[3])
				break
			case 'inputval': // case for a user to input their own value on a long rest
				inputvalRunner(i[0], i[1], i[3])
				break
			case 'randomlist': // case for the current cell to be set to a random value from a list of items
				randomlistRunner(i[0], i[3])
				break
			case 'modconstant': // case for the current cell to be modified by a certain value
				modconstantRunner(i[0], i[3])
				break
			case 'modinput': // case for the current cell to be modified by a value inputted by the user
				modinputRunner(i[0], i[1], i[3])
				break
			case 'srreminder': // case for the sheet to display a reminder for the user on a short rest
				srreminderRunner(i[0], i[1], i[3])
				break
		}
	}
	loadWeapons() // load weapons
	loadNotes() // load notes
	switch (ss.getRange('Character!Z44').getValue()) { // load simple or complex based on selection
		case 'Simple':
			loadSimple()
			break
		case 'Complex':
			loadComplex()
			break
	}

	/** Sets a value to a specific range
	 * @param {string} range 
	 * @param {string} args 
	 */
	function staticRunner(range, args) {
		ss.getRange(range).setValue(args)
	}

	/** Gets user input and sets the inputted value to the range
	 * @param {string} range 
	 * @param {string} title 
	 * @param {string} snippet 
	 */
	function inputvalRunner(range, title, snippet) {
		const res = ui.prompt(title, snippet, ui.ButtonSet.OK_CANCEL) // get user input
		const resT = res.getResponseText() // get the inputted text
		const resB = res.getSelectedButton() // gets the button that was selected
		if (resB == ui.Button.CANCEL) return // ends execution if CANCEL button was pressed
		else if (resB == ui.Button.OK) ss.getRange(range).setValue(resT) // otherwise, sets inputted text to range
	}

	/** Sets a random value from a list based on a previously inputted set of values
	 * @param {string} range 
	 * @param {string} args 
	*/
	function randomlistRunner(range, args) {
		const items = args.split(/, ?/g) // get the items
		const rand = Math.floor(Math.random() * items.length) // get a random index of those items
		ss.getRange(range).setValue(items[rand]) // set the random value
	}

	/** Modifies a specific range by a certain amount
	 * @param {string} range 
	 * @param {string} args 
	*/
	function modconstantRunner(range, args) {
		/** @type {number} */ const pre = ss.getRange(range).getValue() // defines the value of the range before any operations
		const post = ['+', '-'].some(x => x == args.slice(0, 1)) ? pre + Number(args) : pre
		// ^defines the value to be set as the modified version of the original value
		ss.getRange(range).setValue(post) // set the value of the range to post
	}

	/** Modifies specified range by a value that the user inputs
	 * @param {string} range @param {string} title @param {string} snippet */
	function modinputRunner(range, title, snippet) {
		while (true) {
			const res = ui.prompt(title,
				`Enter the number you wish to modify the current value of a cell by (begin with + or -) or enter 0 to make no change\n` +
				`Your snippet is as follows:\n${snippet}`,
				ui.ButtonSet.OK_CANCEL) // create a prompt for the user to enter a value into
			const resT = res.getResponseText() // get the user's response
			const resB = res.getSelectedButton() // get the user's selected button
			if (resB == ui.Button.CANCEL) return // end execution if the user pressed CANCEL
			if (resB == ui.Button.OK) {
				if (!['+', '-', '0'].some(x => resT.startsWith(x))) { // if response didn't start with +, -, or 0
					ui.alert('Error: The value you entered does not follow the proper format. Please try again.') // alert user of error
					continue // and continue
				} else { // otherwise
					if (isNaN(parseInt(resT.slice(1)))) { // if response was not a number
						ui.alert('Error: The value you entered does not follow the proper format.') // alert user of error
						continue // and continue
					}
					const pre = ss.getRange(range).getValue() // get value of range
					const post = ['+', '-', '0'].some(x => resT.slice(0, 1) == x) ? pre + Number(resT) : pre
					// ^defines the value to be set as the modified version of the original value
					ss.getRange(range).setValue(post) // set the value of the range to post
				}
			}
		}
	}

	/** Creates an alert to remind the user of something they inputted
	 * @param {string} range @param {string} title @param {string} snippet */
	function srreminderRunner(range, title, snippet) {
		ui.alert(title, `${snippet}\nThis reminder was set on ${range}`, ui.ButtonSet.OK) // creates the alert
	}
}