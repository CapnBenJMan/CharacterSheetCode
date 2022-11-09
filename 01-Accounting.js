/** @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function accounting(e) {
	const accounting = e.source.getSheetByName('Accounting') // define reference to accounting sheet
	const row = e.range.getRow() // edited row number
	const Lrow = accounting.getLastRow() // define reference to last row
	if (e.range.getSheet().getName() == 'Accounting' && row > 3 && row != Lrow) {
		// ^if current sheet is Accounting, edited row is greater than 3 and edited row is not the last row
		const CoinSet = coinClass() // define reference to coin class
		const totals = accounting.getRange('B3:E3').getValues()[0].map(x => Number(x)) // the values of each coin type total
		const coins = CoinSet.fromRaw(totals) // create coinset from totals
		if (coins.getPoints() < 0) { // if user has less than 0 total money left
			SpreadsheetApp.getUi().alert('You do not have enough coin to complete this transaction.\n' +
				`You still need ${coins.getFormattedPoints()}cp worth of coin to complete this transaction.`)
			// ^alert user of error
			e.range.setValue(e.oldValue) // revert to original value
			return // end execution
		}
		const cell = e.range.getCell(1, 1) // define cell as only top-left corner of edited range
		if (row == 4) { // if edit range was in row 4 of Accounting sheet
			accounting.insertRowAfter(3) // self-explanatory
			accounting.getRange(cell.getRow() + 1, cell.getColumn()).activateAsCurrentCell() // activate cell below current cell
			resetFormulas() // call resetFormulas()
		} else if (row > 4 && Lrow > 5 && isEmptyish(e.value)) {
			// ^if row is greater than 4, last row is greater than 5 and e.value is empty...
			const vals = accounting.getRange(5, 1, Lrow - 5, 5).getValues() // get values of every cell except for the last and first 4
			for (let i = vals.length - 1; i >= 0; i--) if (vals[i].every(x => x == '')) accounting.deleteRow(i + 5)
			// ^loop through each row and delete it if it is completely empty
		}
		if (coins.getRaw().some(x => x < 0)) { // if there are negative values present after transaction has been added...
			accounting.insertRowBefore(row) // add a row for the adjustment
			resetFormulas() // call resetFormulas()
			accounting.getRange(cell.getRow() + 1, cell.getColumn()).activateAsCurrentCell() // activate cell below current cell
			SpreadsheetApp.flush() // flush changes to sheet
			accounting.getRange((row == 4) ? 5 : row, 1, 1, 5).setValues(
				[[`=JOIN(IF(ISBLANK(A${Math.max(6, row + 1)}), ""," "), A${Math.max(6, row + 1)}, "(Adjustment)")`,
			...coins.distribute().getChange().map(x => x != 0 ? x : '')]])
			/* ^set first column to be titled whatever the initial row was titled + (Adjustment) and distribute the
				coins to be no longer negative */ 
		}
	}

	function resetFormulas() { // used when adding/deleting rows changes the sum formulas
		accounting.getRange('B3:E3').setFormulas([['=SUM(B4:B)', '=SUM(C4:C)', '=SUM(D4:D)', '=SUM(E4:E)']])
		// ^This sets the formulas properly
	}
}