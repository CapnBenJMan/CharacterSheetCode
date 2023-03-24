// range[0] | title[1] | type[2] | args[3] | LR bool[4] | SR bool[5] // each element corresponds to a column

/** Compiles values inputted via the lrdialog
 * @param {string} range The range of the cell
 * @param {string} type The type of modification
 * @param {boolean} sr If this value triggers on a short rest
 * @param {string} rest The type of rest taking place
 * @returns 
 */
function restCompiler(range, type, sr, rest) { // range of cell, type of recharge, triggers on short rest
	const ss = SpreadsheetApp.getActiveSpreadsheet()
	const ui = SpreadsheetApp.getUi()
	const restListSheet = ss.getSheetByName('Rest List')
	var lrow = restListSheet.getLastRow()
	if (lrow == 0) { lrow = 1 }
	const rangelist = restListSheet.getRange(1, 1, lrow).getValues().flat()
	var row = restListSheet.getLastRow() + 1
	if (rangelist.includes(range)) row = rangelist.indexOf(range) + 1

	const infoArray = [`="${range}"`, '', type, '', true, sr]
	var returnTrue
	switch (type) {
		case 'current': // case for the current cell to be set to its current value
			infoArray[3] = ss.getCurrentCell().getValue()
			break
		case 'cell': // case for the current cell to be set to the value of a cell reference
			returnTrue = cellCase()
			break
		case 'inputval': // case for a user to input their own value on a long rest
			returnTrue = inputvalCase()
			break
		case 'other': // case for the current cell to be set to a value set by the user
			returnTrue = otherCase()
			break
		case 'randomnum': // case for the current cell to be set to a random number on a long rest
			returnTrue = randomnumCase()
			break
		case 'randomlist': // case for the current cell to be set to a random item on a list
			returnTrue = randomlistCase()
			break
		case 'modconstant': // case for the current cell to be modified by a specific amount
			returnTrue = modconstantCase()
			break
		case 'modinput': // case for the current cell to be modified by an amount entered by the user
			returnTrue = inputvalCase()
			break
		case 'srreminder': // case for the user to be given a reminder on a short rest
			returnTrue = inputvalCase()
			infoArray[4] = false
			infoArray[5] = true
			break
	}
	if (returnTrue == 'return') return // prevents an incomplete rule from being added
	restListSheet.getRange(row, 1, 1, 6).setValues([infoArray]) // adds the rule to the proper range

	function cellCase() {
		// var sheet, cell
		try {
			const res = ui.prompt(
				'Enter the range of the cell you want to reference. (Ex. A1, Character!B2)\n' +
				'Please only enter the range of a single cell, otherwise the code will get mad.\n' +
				'If you do not enter a sheet name, the code will default to the current sheet you are on.\n' +
				`If the name of the sheet you want to reference contains spaces, surround the name with single quotes (')`)
				.getResponseText()

			if (res.includes(':')) throw 'multi'
			// ^if user inputted a reference to more than one cell
			// ui.alert('Error: Please only input a single cell.') // alert the user of an error
			// return 'return' // return the string return so that the code ends early.

			if (res.includes('!')) { // if user inputted a reference to a sheet other than the current one
				if (ss.getRange(res)) infoArray[3] = `=${res}`
				// ^if getting the range doesn't throw an error, set formula to infoArray[3]
				else throw 'exists' // otherwise, throw an error

			} else { // otherwise
				const sheet = ss.getCurrentCell().getSheet().getName().replace(/'/g, '')
				// get the current sheet name
				const cell = res.toUpperCase() // make sure input is upper case
				if (exists(sheet, cell) && ss.getRange(`'${sheet}'!${cell}`)) infoArray[3] = `='${sheet}'!${cell}`
				// ^if range exists and getting the range doesn't throw an error, set formula to infoArray[3]
				else throw 'exists' // otherwise, throw error
			}
		} catch (err) { // error handler
			const errs = {
				'multi': 'Error: Please only input the reference to a single cell.',
				'exists': 'Error: The cell reference you entered does not refer to a cell that exists'
			} // object with cases for error messages
			ui.alert(errs[err] || `Error: Something went wrong that wasn't accounted for.`)
			// ^alerts user to an error
			return 'return' // makes sure the rule isn't saved to the sheet
		}
	}

	function inputvalCase() {
		const resA = ui.prompt(
			`Enter the title of this selection. After entering the title, write a brief snippet detailing what is requiring the input.\n` +
			`Separate the title and snippet with a bar ("|").`
		) // prompts the user for input
		const res = resA.getResponseText() // gets the response
		const resB = resA.getSelectedButton() // ^^and the button selection
		if (resB == ui.Button.OK) { // if OK was pressed
			if (res.includes('|')) { // if res contains |
				const spl = res.split('|') // split res on |
				infoArray[1] = spl[0].toString().trim() // set infoArray[1] (title) to value before |
				infoArray[3] = spl[1].toString().trim() // set infoArray[3] (snippet) to value after |
			} else { // otherwise
				ui.alert('Error: Unable to save. Make sure you included a | and try again.') // alert user of an error
				return 'return' // prevent the current rule from being saved
			}
		} else { // otherwise
			return 'return' // prevent the current rule from being saved
		}
	}

	function otherCase() {
		var res = ui.prompt(
			`Enter the value you want this cell to be reset to on a ${rest} rest.\n` +
			'When entering a boolean (true/false) value, use all caps (ie. TRUE, FALSE).', ui.ButtonSet.OK_CANCEL)
		var resT = res.getResponseText()
		var resB = res.getSelectedButton()
		if (resB == ui.Button.OK) {
			infoArray[3] = resT // v[3] (args) = the response given to the prompter
		} else if (resB == ui.Button.CANCEL) {
			return 'return'
		}
	}

	function randomnumCase() {
		try {
			const res = ui.prompt(
				`Enter the random number to be generated in the form of a dice roll (ie. X1dY1+Z1 X2dY2+Z2 etc.).\n` +
				`X = Number of a type of dice\n` +
				`Y = Type of dice\n` +
				`Z = Number to add to the roll\n` +
				`Ex. 1d4-1 2d6+2 3d3\n` +
				`Important: Be sure to use the formatting above, or else the code will get mad.`
			).getResponseText()
			infoArray[3] = res.split(" ")  // 
				.reduce((arr, cur) => { // first split on spaces then reduce
					const m = cur.match(/(\d+)d(\d+)([+-]\d+)?/i) // find matches to the format of XdY+-Z
						.filter(x => x != cur) // filter out the match itself
						.map((x, i) => i < 2 ? Number(x) : x) // make sure each of the first 2 items is a number
					arr.push(m) // push m to array
					return arr // return array
				}, Array())
				.reduce((str, cur, i) => str + // reduce through previous array
					(i > 0 ? '+' : '') + // add + if index is greater than 0
					[...Array(cur[0])].map(() => `RANDBETWEEN(1,${cur[1]})`).join('+') +
					// ^create an array of randbetween functions and join them with +
					(cur[2] !== undefined ? cur[2] : '') // add cur[2] if it is not undefined
					, '=')
		} catch { // if code encountered an error
			ui.alert('Error: Something went wrong. Please try again') // alert user of error
			return 'return' // prevent rule from being saved
		}
	}

	function randomlistCase() {
		const valCrit = SpreadsheetApp.DataValidationCriteria // data validation criteria
		const cell = ss.getCurrentCell() // current cell
		const cellVal = cell.getDataValidation() // current cell's data validation
		if (cellVal == null) { // if cell has no data validations
			infoArray[3] = manualListBuilder() // proceed to manual and set v[3] (args) to returned string
		} else if ([valCrit.VALUE_IN_LIST, valCrit.VALUE_IN_RANGE].some(x => x == cellVal.getCriteriaType())) { // if current cell already has a dropdown list...
			var but = ui.alert( // ...alert the user of this and ask if they would like to use it
				`The cell you have selected contains a dropdown list. ` +
				`Would you like to have the code use the values of this list (Yes) ` +
				`or would you like to enter your own (No)?`,
				ui.ButtonSet.YES_NO_CANCEL
			)
			switch (but) {
				case ui.Button.YES:
					infoArray[3] = autoListBuilder() // if yes, proceed to auto and set (args) to returned string
					break
				case ui.Button.NO:
					infoArray[3] = manualListBuilder() // if no, proceed to manual and set (args) to returned string
					break
				case ui.Button.CANCEL:
					return 'return' // if cancel, return and end code
			}
		}

		function autoListBuilder() { // auto
			const items = (cellVal.getCriteriaType() == valCrit.VALUE_IN_RANGE) ?
				cellVal.getCriteriaValues()[0].getValues().flat() : cellVal.getCriteriaValues()[0]
			// ^define items as the values of the dropdown list (doesn't matter if val in range or val in list)
			return items.join(`, `) // return items separated by (", ")
		}

		function manualListBuilder() { // manual
			const prompt = ui.prompt(`Please enter your random values separated by commas (",")`).getResponseText() // prompt is the response text
			return prompt.split(/, ?/).map(x => x.trim()).join(", ") // return items separated by (", ")
		}
	}

	function modconstantCase() {
		const input = ui.prompt(
			`Please enter the number you want this cell to be modified by on a ${rest} rest.\n` +
			`For adding, start with a "+". For subtracting, start with a "-"`,
		).getResponseText() // get user input
		const inputNum = parseInt(input.slice(1)) // parse input disregarding modifier
		if (isNaN(inputNum) || !['+', '-'].some(x => input.startsWith(x))) { // if inputNum is not a number...
			ui.alert(`Error: Please make sure you used the propper format and that the value you entered is a number`)
			// ^alert user of error
			return 'return' // return to end code
		} else if (['+', '-'].some(x => input.startsWith(x))) { // otherwise
			infoArray[3] = input // set args to input
		}
	}
}