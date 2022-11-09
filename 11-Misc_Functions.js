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