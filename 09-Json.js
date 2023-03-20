/** @param {GoogleAppsScript.Events.SheetsOnEdit} e */
function jsonSwap(e) {
	// Spreadsheet Reference
	const ss = e.source || SpreadsheetApp.getActiveSpreadsheet()

	// Get Object that represents edited range
	var curr = '' // variable used for debugging function
	// let time = x => { // debugging function for logging execution time
	// 	console.timeEnd(curr)
	// 	console.time(x)
	// 	curr = x
	// }
	const value = e.value || "Page 1"
	const oldValue = e.oldValue || "Page 1"
	console.log("JSON")
	if (!isEmptyish(e)) console.log(e.range.getA1Notation().replace(/:.+/, ""))
	var a1 = e.range.getCell(1, 1).getA1Notation() || "T31"
	var mode = ss.getRange('Character!Z44').getValue()
	const obj = [
		{ name: 'Notes', targetRange: 'Character!R37:AF42', inputRange: 'Character!R43', col: 1, searchRange: 'H2:H' },
		{ name: 'Weapons', targetRange: 'Character!R32:AF36', inputRange: 'Character!T31', col: 1, searchRange: 'F2:F' },
		{ name: 'SimpleLeft', targetRange: 'Character!Z45:AF56', inputRange: 'Character!Z57', col: -1, searchRange: 'B2:B' },
		{ name: 'SimpleRight', targetRange: 'Character!AH45:AN56', inputRange: 'Character!Z57', col: 1, searchRange: 'B2:B' },
		{ name: 'ComplexLeft', targetRange: 'Character!Z45:AF56', inputRange: 'Character!Z57', col: 1, searchRange: 'D2:D' },
		{ name: 'ComplexRight', targetRange: 'Character!AH45:AN56', inputRange: 'Character!AH57', col: 1, searchRange: 'D2:D' }
	].find(x => {
		if (a1 == 'Z57' || a1 == 'AH57') return x.inputRange.includes(a1) && x.name.includes(mode)
		return x.inputRange.includes(a1)
	})

	console.log(obj)

	const range = ss.getRange(obj.targetRange) // target range
	const pages = ss.getSheetByName('Pages')
	const contentRange = pages.getRange(obj.searchRange)
	const formatSheet = ss.getSheetByName('Formatting')
	const formatRange = formatSheet.getRange(obj.searchRange)

	// Savepoints
	const saves1 = contentRange.createTextFinder(oldValue).findNext()
	const contentSavepoint = pages.getRange(saves1.getRow(), saves1.getColumn() + obj.col)
	const saves2 = formatRange.createTextFinder(oldValue).findNext()
	const formatSavepoint = formatSheet.getRange(saves2.getRow(), saves2.getColumn() + obj.col)

	// Loadpoints
	const loads1 = contentRange.createTextFinder(value).findNext()
	const contentLoadpoint = pages.getRange(loads1.getRow(), loads1.getColumn() + obj.col)
	const loads2 = formatRange.createTextFinder(value).findNext()
	const formatLoadpoint = formatSheet.getRange(loads2.getRow(), loads2.getColumn() + obj.col)

	// Load JSON
	/** @type {{values: any[][], notes: string[][], vals: ((string | any[])[] | null)[][], merges: string[]}} */
	const content = JSON.parse(contentLoadpoint.getValue())
	/** @type {{ num: string[][], hori: string[][], vert: string[][], font: {f: string | null, s: number | null;}[][], color: string[][], styles: { b?: string; i?: string; s?: string; u?: string;}[][] }} */
	const formatting = JSON.parse(formatLoadpoint.getValue())

	// Load Content Initialization
	const loadValis = validationBuilder(ss, content.vals)

	// Load Format Initialization
	const font0 = formatting.font.map(x => x.map(y => { return { f: y.f, si: y.s } }))
	const all = [...Array(font0.length)].map((_x, i) => Array(font0[0].length).map((_y, j) => {
		return {
			...font0[i][j],
			c: formatting.color[i][j],
			...formatting.styles[i][j]
		}
	}))
	const textStyles = textstyleBuilder(all)
	const loadNumformats = formatting.num.map(x => x.map(y => (y == '÷') ? '0.###############' : y))
	// Promise.resolve(formatting.num.map(x => x.map(y => (y == '÷') ? '0.###############' : y)))
	const loadHori = formatting.hori.map(x => x.map(y => {
		switch (y) {
			case 'l':
				return 'left'
			case 'c':
				return 'center'
			case 'r':
				return 'right'
		}
	}))
	/* Promise.resolve(formatting.hori.map(x => x.map(y => {
		switch (y) {
			case 'l':
				return 'left'
			case 'c':
				return 'center'
			case 'r':
				return 'right'
		}
	}))) */
	const loadVert = formatting.vert.map(x => x.map(y => {
		switch (y) {
			case 't':
				return 'top'
			case 'm':
				return 'middle'
			case 'b':
				return 'bottom'
		}
	}))
	/* Promise.resolve(formatting.vert.map(x => x.map(y => {
		switch (y) {
			case 't':
				return 'top'
			case 'm':
				return 'middle'
			case 'b':
				return 'bottom'
		}
	}))) */

	// Save Content
	const saveMerges = range.getMergedRanges().map(x => x.getA1Notation())
	const forms = range.getFormulas()
	const saveValues = range.getValues().map((x, i) => x.map((y, j) => (forms[i][j] != '') ? forms[i][j] : y))
	const saveNotes = range.getNotes()
	const saveValis = range.getDataValidations().map(x => x.map(y => {
		if (y == null) return null
		const critType = y.getCriteriaType().toString(),
			critValues = y.getCriteriaValues()
		return [critType,
			critType == 'VALUE_IN_RANGE' ? [`'${critValues[0].getSheet().getName()}'!${critValues[0].getA1Notation()}`, critValues[1]] : critValues]
	}))
	const backgroundColor = range.getBackgrounds()
	/* Promise.resolve(range.getDataValidations().map(x => x.map(y => {
		if (y == null) {
			return null
		} else {
			var critType = y.getCriteriaType().toString(),
				critValues = y.getCriteriaValues()
			return [critType,
				critType == 'VALUE_IN_RANGE' ? [`'${critValues[0].getSheet().getName()}'!${critValues[0].getA1Notation()}`, critValues[1]] : critValues]
		}
	}))) */

	// Save Format
	const saveNumform = range.getNumberFormats().map(x => x.map(y => y == "0.###############" ? '÷' : y))
	const saveHori = range.getHorizontalAlignments().map(x => x.map(y => {
		if (y.includes('general') && !y.includes('-')) {
			return 'l'
		} else if (y.includes('general') && y.includes('-')) {
			return y.replace('general-', '').slice(0, 1)
		} else {
			return y.charAt(0)
		}
	}))
	const saveVert = range.getVerticalAlignments().map(x => x.map(y => {
		if (y.includes('general') && !y.includes('-')) {
			return 'm'
		} else if (y.includes('general') && y.includes('-')) {
			return y.slice(8, 9)
		} else {
			return y.charAt(0)
		}
	}))
	const text = range.getTextStyles()
	const font = text.map(x => x.map(y => { return { f: y.getFontFamily(), s: y.getFontSize() } }))
	// new Promise((res, _rej) => res(text.map(x => x.map(y => { return { f: y.getFontFamily(), s: y.getFontSize() } }))))
	// Promise.resolve(text.map(x => x.map(y => { return { f: y.getFontFamily(), s: y.getFontSize() } })))
	const color = text.map(x => x.map(y => y.getForegroundColorObject().asRgbColor().asHexString()))
	// new Promise((res, _rej) => res(text.map(x => x.map(y => y.getForegroundColorObject().asRgbColor().asHexString()))))
	// Promise.resolve(text.map(x => x.map(y => y.getForegroundColorObject().asRgbColor().asHexString())))
	const styles = text.map(x => x.map(y => {
		var arr = {}
		if (y.isBold()) arr.b = ''
		if (y.isItalic()) arr.i = ''
		if (y.isStrikethrough()) arr.s = ''
		if (y.isUnderline()) arr.u = ''
		return arr
	}))
	/* new Promise((res, _rej) => {
		res(text.map(x => x.map(y => {
			var arr = {}
			if (y.isBold()) arr.b = 't'
			if (y.isItalic()) arr.i = 't'
			if (y.isStrikethrough()) arr.s = 't'
			if (y.isUnderline()) arr.u = 't'
			return arr
		})))
	}) */
	/* Promise.resolve(text.map(x => x.map(y => {
		var arr = {}
		if (y.isBold()) arr.b = 't'
		if (y.isItalic()) arr.i = 't'
		if (y.isStrikethrough()) arr.s = 't'
		if (y.isUnderline()) arr.u = 't'
		return arr
	}))); */
	/* var font = [...Array(text.length)].map(() => Array(text[0].length)),
		color = [...Array(text.length)].map(() => Array(text[0].length)),
		styles = [...Array(text.length)].map(() => Array(text[0].length)) */
	/* for (i in text) {
		for (j in text[i]) {
			var y = text[i][j]
			font[i][j] = { f: y.getFontFamily(), s: y.getFontSize() }
			color[i][j] = y.getForegroundColorObject().asRgbColor().asHexString()
			var x = {}
			if (y.isBold()) x.b = 't'
			if (y.isItalic()) x.i = 't'
			if (y.isStrikethrough()) x.s = 't'
			if (y.isUnderline()) x.u = 't'
			styles[i][j] = x
		}
	} */

	/* console.time("Font")
	const font = text.map(x => x.map(y => { return { f: y.getFontFamily(), s: y.getFontSize() } }))
	console.timeEnd("Font")
	console.time("Color")
	const color = text.map(x => x.map(y => y.getForegroundColorObject().asRgbColor().asHexString()))
	console.timeEnd("Color")
	console.time("Styles")
	const styles = text.map(x => x.map(y => {
		var x = {}
		if (y.isBold()) x.b = 't'
		if (y.isItalic()) x.i = 't'
		if (y.isStrikethrough()) x.s = 't'
		if (y.isUnderline()) x.u = 't'
		return x
	}))
	console.timeEnd("Styles"); */


	const page = {
		values: saveValues,
		notes: saveNotes,
		vals: /* await  */saveValis,
		merges: saveMerges,
		backgrounds: backgroundColor
	}
	console.log("Page")
	const format = {
		num: saveNumform,
		hori: saveHori,
		vert: saveVert,
		font: /* await  */font,
		color: /* await  */color,
		styles: /* await  */styles
	}
	console.log("Format")
	console.log(page)
	console.log(format)
	range.breakApart().clearContent().clearDataValidations().clearNote()

	range
		.setDataValidations(loadValis)
		.setNumberFormats(loadNumformats)
		.setHorizontalAlignments(loadHori)
		.setVerticalAlignments(loadVert)
		.setTextStyles(textStyles)
		.setValues(content.values)
		.setNotes(content.notes)
	if (content.merges.length > 0) {
		e.range.getSheet().getRangeList(content.merges).getRanges().forEach(x => x.merge())
	}
	SpreadsheetApp.flush()

	/* await Promise.all([loadValis, loadNumformats, loadHori, loadVert, textStyles]).then(vals => {
		console.log(vals)
		range
			.setDataValidations(vals[0])
			.setNumberFormats(vals[1])
			.setHorizontalAlignments(vals[2])
			.setVerticalAlignments(vals[3])
			.setTextStyles(vals[4])
			.setValues(content.values)
			.setNotes(content.notes)
		if (content.merges.length > 0) {
			e.range.getSheet().getRangeList(content.merges).getRanges().forEach(x => x.merge())
		}
	}) */

	/* console.log(content.merges)
	console.log("Valis", loadValis)
	console.log("Number Formats", loadNumformats)
	console.log("Horizontal Alignments", loadHori)
	console.log("Vertical Alignments", loadVert)
	console.log("Text Styles", textStyles)
	try { e.range.getSheet().getRangeList(content.merges).getRanges().forEach(x => x.merge()); } catch (err) { console.error(err) }
	range.setDataValidations(loadValis)
	console.log("Validations")
	range.setNumberFormats(loadNumformats)
	console.log("Number Formats")
	range.setHorizontalAlignments(loadHori)
	console.log("Horizontal Alignments")
	range.setVerticalAlignments(loadVert)
	console.log("Vertical Alignments")
	range.setTextStyles(textStyles)
	console.log("Text Styles")
	range.setValues(content.values)
	console.log("Values")
	range.setNotes(content.notes)
	console.log("Notes") */


	const savejson1 = JSON.stringify(page)
	console.log(savejson1)
	console.log(savejson1.length)
	const savejson2 = JSON.stringify(format)
	console.log(savejson2)
	console.log(savejson2.length)
	contentSavepoint.setValue(savejson1)
	formatSavepoint.setValue(savejson2)

}
/*
function saveJSON(arr, key) {
	const ss = SpreadsheetApp.getActiveSpreadsheet()
	const range = ss.getRange(arr.targetRange) // target range
	const s1 = ss.getSheetByName('Pages').createTextFinder(key).findNext()
	const savepoint1 = ss.getSheetByName('Pages').getRange(s1.getRow(), s1.getColumn() + arr.col)
	const s2 = ss.getSheetByName('Formatting').createTextFinder(key).findNext()
	const savepoint2 = ss.getSheetByName('Formatting').getRange(s2.getRow(), s2.getColumn() + arr.col)
	const merges = range.getMergedRanges().map(x => x.getA1Notation())
	const forms = range.getFormulas()
	var values = range.getValues()
	const notes = range.getNotes()
	const numform = range.getNumberFormats().map(x => x.map(y => y == "0.###############" ? '×÷' : y))
	const horizontal = range.getHorizontalAlignments().map(x => x.map(y => {
		if (y.includes('general') && !y.includes('-')) {
			return 'l'
		} else if (y.includes('general') && y.includes('-')) {
			return y.replace('general-', '').slice(0, 1)
		} else {
			return y.slice(0, 1)
		}
	}))
	const vertical = range.getVerticalAlignments().map(x => x.map(y => {
		if (y.includes('general') && !y.includes('-')) {
			return 'l'
		} else if (y.includes('general') && y.includes('-')) {
			return y.replace('general-', '').slice(0, 1)
		} else {
			return y.slice(0, 1)
		}
	}))
	const vals0 = range.getDataValidations().map(x => x.map(y => {
		if (y == null) {
			return null
		} else {
			var critType = y.getCriteriaType().toString(),
				critValues = y.getCriteriaValues()
			return [critType,
				critType == 'VALUE_IN_RANGE' ? [`'${critValues[0].getSheet().getName()}'!${critValues[0].getA1Notation()}`, critValues[1]] : critValues]
		}
	}))
	for (var i in forms) { // nested for loop - i is rows
		for (var j in forms[i]) { // j is columns
			if (forms[i][j] != "") values[i][j] = forms[i][j] // ...set equivalent range in values to that formula
		}
	}
	const text = range.getTextStyles()
	const font = text.map(x => x.map(y => { return { f: y.getFontFamily(), s: y.getFontSize() } }))
	const color = text.map(x => x.map(y => y.getForegroundColorObject().asRgbColor().asHexString()))
	const styles = text.map(x => x.map(y => {
		return {
			b: y.isBold() ? 't' : 'f',
			i: y.isItalic() ? 't' : 'f',
			s: y.isStrikethrough() ? 't' : 'f',
			u: y.isUnderline() ? 't' : 'f'
		}
	}))

	const page = {
		values: values,
		notes: notes,
		vals: vals0,
		merges: merges
	}
	const format = {
		num: numform,
		hori: horizontal,
		vert: vertical,
		font: font,
		color: color,
		styles: styles
	}
	const json1 = JSON.stringify(page)
	console.log(json1)
	console.log(json1.length)
	const json2 = JSON.stringify(format)
	console.log(json2)
	console.log(json2.length)
	savepoint1.setValue(json1)
	savepoint2.setValue(json2)
	// range.breakApart().clearContent().clearDataValidations().clearNote()
}

function loadJSON(arr, key) {
	const ss = SpreadsheetApp.getActiveSpreadsheet()
	const range = ss.getRange(arr.targetRange)
	const s1 = ss.getSheetByName('Pages').createTextFinder(key).findNext()
	const loadpoint1 = ss.getSheetByName('Pages').getRange(s1.getRow(), s1.getColumn() + arr.col)
	const s2 = ss.getSheetByName('Formatting').createTextFinder(key).findNext()
	const loadpoint2 = ss.getSheetByName('Formatting').getRange(s2.getRow(), s2.getColumn() + arr.col)
	const json1 = JSON.parse(loadpoint1.getValue())
	const json2 = JSON.parse(loadpoint2.getValue())
	range
		.setValues(json1.values)
		.setNotes(json1.notes)
		.setDataValidations(validationBuilder(ss, json1.vals))
	SpreadsheetApp.flush()
	range
		.setTextStyles(textstyleBuilder(
			json2.font,
			json2.color,
			json2.styles,
			json2.font.length,
			json2.font[0].length))
		.setNumberFormats(json2.num.map(x => x.map(y => {
			if (y == '×÷') return '0.###############'
			return y
		})))
		.setHorizontalAlignments(json2.hori.map(x => x.map(y => {
			switch (y) {
				case 'l':
					return 'left'
				case 'c':
					return 'center'
				case 'r':
					return 'right'
			}
		})))
		.setVerticalAlignments(json2.vert.map(x => x.map(y => {
			switch (y) {
				case 't':
					return 'top'
				case 'm':
					return 'middle'
				case 'b':
					return 'bottom'
			}
		})))
	SpreadsheetApp.flush()
	ss.getRangeList(json1.merges).getRanges().forEach(x => x.merge())
}*/