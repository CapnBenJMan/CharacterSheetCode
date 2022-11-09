/**
 * @param {string} category 
 * @param {string} name 
 * @returns {string}
 */
function setEquipment(category, name) {
	const ss = SpreadsheetApp.getActiveSpreadsheet() // define spreadsheet reference
	const cell = ss.getActiveCell() // define reference to selected cell
	let GR = n => ss.getRange(n) // define arrow function to easily get a range
	try {
		const sheetName = cell.getSheet().getName() // define the sheet name of the current cell
		if (['Character', 'Storage'].every(x => x != sheetName)) throw 'sheet'
		// ^end execution if cell is not in Character or Storage sheet
		const { tf: char } = isWithinRange(cell, [GR('Character!I60:W84'), GR('Character!Z60:AN84')])
		// ^is the current cell within the storage area of the character sheet?
		const { tf: sto1 } = isWithinRange(cell, [GR('Storage!I3:W27'), GR('Storage!Z3:AN27')])
		// ^is the current cell within the primary storage area of the storage sheet?
		const { tf: sto2 } = isWithinRange(cell, [GR('Storage!I32:W56'), GR('Storage!Z32:AN56')])
		// ^is the current cell within the secondary storage area of the storage sheet?
		const { tf: sto3 } = isWithinRange(cell, [GR('Storage!I61:W85'), GR('Storage!Z61:AN85')])
		// ^is the current cell within the tertiary storage area of the storage sheet?
		const { tf: sto4 } = isWithinRange(cell, [GR('Storage!I90:W114'), GR('Storage!Z90:AN114')])
		// ^is the current cell within the quaternary storage area of the storage sheet?
		if (![char, sto1, sto2, sto3, sto4].some(x => x)) throw 'range'
		// ^end execution if cell is not in the proper range

		/** 
		 * @type {{Name: string, Cost: string, Weight: string, Quantity: string, Note?: string, Contents?: 
		 * 		{Name: string, Cost: string, Weight: string, Quantity: string, Note?: string}[]
		 * }} 
		 */
		const obj = equipmentInfo()[category].find(x => x.Name == name)
		// ^define reference to equipment storage object
		const row = cell.getRow() // define cell's row
		const col = cell.getColumn() // define cell's column
		const colStart = (col >= 9 && col <= 24) ? 9 : (col >= 26 && col <= 38) ? 26 : 0
		// ^defines the starting position of the equipment insertion
		const limit = char ? 84 : // if cell is in the character storage area
			sto1 ? 27 :// if cell is in the primary storage area
				sto2 ? 56 :// if cell is in the secondary storage area
					sto3 ? 85 :// if cell is in the tertiary storage area
						sto4 ? 114 : 0 // if cell is in the quaternary storage area
		// ^defines the bottom-most row that an equipment piece can be put into
		// ^(used for equipment packs)
		/** @type {string} */
		const adj = ("Weight" in obj && obj["Weight"] != '-') ? obj["Weight"].replace(/[^\d\/\.]/g, '') : '-'
		// ^gets the weight of an object, keeping all digit characters, '.'s and '/'s,
		const weight = ("Weight" in obj && adj != '-') ?
			(adj.includes('/') ? Number(adj.split('/')[0]) / Number(adj.split('/')[1]) : Number(adj))
			: '-'
		// ^returns the calculated weight of an item
		if ("Contents" in obj) { // if item is an equipment pack
			const targetRange = ss.getSheetByName(sheetName).getRange(row, colStart, obj["Contents"].length + 1, 15)
			// ^define reference to target range
			if (!targetRange.isBlank()) throw 'blank' // if the range is not blank, throw error
			if (obj["Contents"].length + row > limit) throw 'oob' // throw error if out of bounds
			// 15 wide
			const vals = [['', obj["Name"], '', '', '', '', '', '', '', obj["Cost"], '', '', '', '', '']]
			// ^define vals as 2d array for range values
			const notes = [[...Array(15)].map(x => x = '')] // define empty 2d array for notes
			for (let a = 0; a < obj["Contents"].length; a++) { // loop through contents
				const arr = [...Array(15)].map(x => x = '')  // define empty array for values
				const arr1 = [...Array(15)].map(x => x = '') // define empty array for notes
				const item = obj["Contents"][a] // define reference to current item
				/** @type {string} */
				const adj1 = (item["Weight"] != '-') ? item["Weight"].replace(/[^\d\/\.]/g, '') : '-'
				// ^gets the weight of the current item
				const weight1 = adj1 != '-' ?
					(adj1.includes('/') ? Number(adj1.split('/')[0]) / Number(adj1.split('/')[1]) : Number(adj1))
					: '-'
				// ^returns the calculated weight of an item
				arr[0] = item["Quantity"] // first value in row is quantity
				arr[1] = ' ↳ ' + item["Name"] // next value is name + arrow to show item is in equipment pack
				arr[9] = item["Cost"].replace('—', '-') // next value is the cost per item
				arr[12] = weight1 // last value is the weight
				vals.push(arr) // push arr to vals array
				if ("Note" in item) arr1[1] = item["Note"] // add a note for the item if it has one
				notes.push(arr1) // push arr1 to notes array
			}
			targetRange // set values and notes to range
				.setValues(vals)
				.setNotes(notes)
		} else { // if regular item
			const targetRange = ss.getSheetByName(sheetName).getRange(row, colStart, 1, 15)
			// ^define reference to target range
			if (!targetRange.isBlank()) throw 'blank' // throw error if the target range is not blank
			targetRange.setValues(
				[[obj["Quantity"], obj["Name"], '', '', '', '', '', '', '', obj["Cost"].replace('—', '-'), '', '', weight, '', '']]
			)
			// ^set values of item to target range
		}
		if ("Note" in obj) ss.getSheetByName(sheetName).getRange(row, colStart + 1).setNote(obj["Note"])
		// ^set notes of item to target range if item has a note
		return 'success'
	} catch (err) { return String(err) }
}