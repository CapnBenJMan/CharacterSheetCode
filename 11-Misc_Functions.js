/** Returns true if a is undefined, null, an empty string, or '#N/A', otherwise returns false */
function isEmptyish(a) {
	// ^returns a boolean stating whether or not a is undefined, null, an empty string, or '#N/A'
	return [
		undefined,
		null,
		'',
		'#N/A'
	].some(x => x == a)
}

/** Returns an array of numbers. Both the lower and upper limits are inclusive
 * @param {number} x The lower limit if y is also included, or it is the upper limit if y is not included
 * @param {number} y The upper limit
 * @param {number} z The rate of incrementation, defaults to 1
 */
function numRange(x, y = x, z = 1) {
	const arr = []
	const lower = x == y ? 0 : x,
		upper = y
	for (let i = lower; i <= upper; i += z) arr.push(i)
	return arr
}

/** Returns a column number based on the alpha characters of a range string 
 * @param {string} x Ex. 'A', 'BC', etc.
*/
function A1toCol(x) {
	return x.split("")
		.reverse()
		.reduce((total, x, i) => total + (x.charCodeAt(0) - 64) * (26 ** i), 0)
}


/** Fixes a series of broken imgur links in spreadsheet.
 * 
 */
function fixBrokenImages() {
	const ss = SpreadsheetApp.getActiveSpreadsheet()

	const replacements = [
		["Character!B10", `=IMAGE("https://i.imgur.com/u3YeDks.png",2)`],
		["Character!B11", `=IMAGE("https://i.imgur.com/VUGDDJt.png",2)`],
		["Character!E11", `=IMAGE("https://i.imgur.com/u9a6TBA.png",2)`],
		["Character!B42", `=IMAGE("https://i.imgur.com/2e2hhyX.png",2)`],
		["Character!G10", `=IMAGE("https://i.imgur.com/0VlrXCA.png",2)`],
		["Character!S4", `=IMAGE("https://i.imgur.com/OlUFGxq.png",2)`],
		["Character!S9", `=IMAGE("https://i.imgur.com/6avJSbK.png",2)`],
		["Character!O10", `=IMAGE("https://i.imgur.com/GFrq6pf.png",2)`],
		["Character!B44", `=IMAGE("https://i.imgur.com/wJZp2Dm.png",2)`],
		["Character!C48", `=IMAGE("https://i.imgur.com/IxRRFOd.png",2)`],
		["Character!O48", `=IMAGE("https://i.imgur.com/RzcHHl9.png",2)`],
		["Character!Q30", `=IMAGE("https://i.imgur.com/AaGmGAX.png",2)`],
		["Character!Q10", `=IMAGE("https://i.imgur.com/sMN3tei.png",2)`],
		["Character!Q11", `=IMAGE("https://i.imgur.com/r6YjQVe.png",2)`],
		["Character!T11", `=IMAGE("https://i.imgur.com/k6zj6md.png",2)`],
		["Character!X11", `=IMAGE("https://i.imgur.com/k6zj6md.png",2)`],
		["Character!V24", `=IMAGE("https://i.imgur.com/k6zj6md.png",2)`],
		["Character!Q29", `=IMAGE("https://i.imgur.com/pxrdqMy.png",2)`],
		["Character!AD10", `=IMAGE("https://i.imgur.com/sMN3tei.png",2)`],
		["Character!AD29", `=IMAGE("https://i.imgur.com/pxrdqMy.png",2)`],
		["Character!AK5", `=IFS(Lvl<5,IMAGE("http://i.imgur.com/zDHOU0r.png",2),Lvl<11,IMAGE("http://i.imgur.com/0jIT5AA.png",2),Lvl<17,IMAGE("http://i.imgur.com/qN7jDhM.png",2),TRUE, IMAGE("http://i.imgur.com/brqhftZ.png",2))`],
		["Character!AN5", `=IFS(Lvl<5,IMAGE("http://i.imgur.com/stPe4fo.png",2),Lvl<11,IMAGE("http://i.imgur.com/PVGeU3d.png",2),Lvl<17,IMAGE("http://i.imgur.com/mnwcuFl.png",2),TRUE, IMAGE("http://i.imgur.com/TfiOReG.png",2))`],
		["Details!C9", `=IMAGE("https://i.imgur.com/IxRRFOd.png",2)`],

	]

	for (let [a1, formula] of replacements) {
		ss.getRange(a1).setFormula(formula)
	}
}