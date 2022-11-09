/**
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss 
 * @param {((string | any[])[] | null)[][]} vals 
 */
function validationBuilder(ss, vals) {
	const dv = SpreadsheetApp.newDataValidation
	return vals.map(x => x.map(y => {
		if (y == null) return null
		switch (y[0]) {
			case 'CHECKBOX':
				return dv().requireCheckbox().build()
			case 'VALUE_IN_RANGE':
				return dv().requireValueInRange(ss.getRange(y[1][0])).setAllowInvalid(y[1][1]).build()
			default:
				return dv().withCriteria(SpreadsheetApp.DataValidationCriteria[y[0]], y[1]).build()
		}
	}))
}

// /**
//  * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss 
//  * @param {((string | any[])[] | null)[][]} vals 
//  * @returns {Promise<GoogleAppsScript.Spreadsheet.DataValidation[][]>}
//  */
/* function validationBuilder(ss, vals) {
	const dv = SpreadsheetApp.newDataValidation
	return new Promise((res, rej) => {
		const valis = vals.map(x => x.map(y => {
			switch (y[0]) {
				case 'CHECKBOX':
					return dv().requireCheckbox().build()
				case 'VALUE_IN_RANGE':
					return dv().requireValueInRange(ss.getRange(y[1][0])).setAllowInvalid(y[1][1]).build()
				default:
					return dv().withCriteria(SpreadsheetApp.DataValidationCriteria[y[0]], y[1]).build()
			}
		}))
		res(valis)
	})
} */

// /**
//  * @param {string} a 
//  * @returns {{ name: string, targetRange: string, searchRange: string, col: number }}
//  */
/* 
function arrayReturn(a) {
	return [
		{ name: 'Notes', targetRange: 'Character!R37:AF42', searchRange: 'Character!R43', col: 1 },
		{ name: 'Weapons', targetRange: 'Character!R32:AF36', searchRange: 'Character!T31', col: 1 },
		{ name: 'SimpleLeft', targetRange: 'Character!Z45:AF56', searchRange: 'Character!Z57', col: -1 },
		{ name: 'SimpleRight', targetRange: 'Character!AH45:AN56', searchRange: 'Character!Z57', col: 1 },
		{ name: 'ComplexLeft', targetRange: 'Character!Z45:AF56', searchRange: 'Character!Z57', col: -1 },
		{ name: 'ComplexRight', targetRange: 'Character!AH45:AN56', searchRange: 'Character!AH57', col: 1 }
	].find(x => x.name == a)
} */

/**
 * @param {{
 *   b?: string | undefined
 *   i?: string | undefined
 *   s?: string | undefined
 *   u?: string | undefined
 *   c: string
 *   f: string | null
 *   si: number | null; }[][]} all
 */
function textstyleBuilder(all) {
	console.time('Style Builder')
	const text = all.map(x => x.map(y => {
		return SpreadsheetApp.newTextStyle()
			.setFontFamily(y.f)
			.setFontSize(y.si)
			.setForegroundColor(y.c)
			.setBold("b" in y)
			.setItalic("i" in y)
			.setStrikethrough("s" in y)
			.setUnderline("u" in y)
			.build()
	}))
	console.timeEnd('Style Builder')
	console.log(text)
	return text
}

// /**
//  * @param {{ f:string, s:number }[][]} font
//  * @param {string[][]} color
//  * @param {{ b?:string, i?:string, s?:string, u?:string }[][]} styles
//  * @returns {Promise<GoogleAppsScript.Spreadsheet.TextStyle[][]>}
//  */
/* function textstyleBuilder(font, color, styles) {
	console.time('Style Builder')
	const font0 = font.map(x => x.map(y => { return { f: y.f, si: y.s } }))
	const all = [...Array(font.length)].map((x, i) => Array(font[0].length).map((y, j) => {
		return {
			...font0[i][j],
			c: color[i][j],
			...styles[i][j]
		}
	}))
	return new Promise((res, _rej) => {
		const text = all.map(x => x.map(y => {
			return SpreadsheetApp.newTextStyle()
				.setFontFamily(y.f)
				.setFontSize(y.si)
				.setForegroundColor(y.c)
				.setBold("b" in y)
				.setItalic("i" in y)
				.setStrikethrough("s" in y)
				.setUnderline("u" in y)
				.build()
		}))
		console.timeEnd('Style Builder')
		console.log(text)
		res(text)
	})
} */