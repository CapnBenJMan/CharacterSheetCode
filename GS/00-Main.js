/*
Copyright (c) 2022-2023 Ben Craven. All rights reserved.
This software, which includes this file and all files that contain the suffixes ".gs", ".js", or ".html" in this project,
is licensed under the  Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License (CC BY-NC-SA).
The license in its entirety can be found at https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
*/

/** @param {GoogleAppsScript.Events.SheetsOnOpen} i */
function version(i) {
	//version update
	const v1 = "v3.6.4" // sheet/code version
	var rangeLHT = i.source.getRange("Legal and How-to!M4")
	var rangeLBV = i.source.getRange('Legal and How-to!AC5')
	const v2 = 37 // compatible library version. CHECK WHENEVER YOU UPDATE AND MAKE SURE THIS NUMBER IS 1 + WHATEVER THE LATEST VERSION WHEN YOU DEPLOY A NEW VERSION
	if (rangeLHT.getValue() != v1) {
		rangeLHT.setValue(v1) // set sheet version to current value if different
	}
	if (rangeLBV.getValue() != v2) {
		rangeLBV.setValue(v2) // set library version to current value if different
	}
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e 
 * @param {string} [id]
 */
function trigger(e, id) { //onEdit callbacks
	//healthDepreciated(e)
	const name = e.range.getSheet().getName()
	const a1 = e.range.getA1Notation().replace(/:.+/, "")
	const sheetNames = e.source.getSheets().map(x => x.getName()).filter(x => x.includes('Spells'))
	if (id == '1IOzfu9LPV-Vv3IJ3caolxHw-W1YJiyYAluXDfmbPiFs' && true == false) { // You are currently passing '0' in the test sheet
		//Test copy of sheet
		switch (name) {
			case 'Character': // if in Character sheet
				switch (a1) {
					case 'R43': // if range changes a page-style area
					case 'T31': // ^^^
					case 'Z57': // ^^^
						console.log('jsonSwap') // log this
						jsonSwap(e) // run jsonSwap(e)
						break
					case 'Z44': // if changing to or from simple and complex mode
					case 'AH57': // if edited range is right column in complex mode
						console.log('features') // log this
						features(e) // run features(e)
						break
					case 'AI31': // if range is the armor cell
						armor(e) // run armor(e)
						break
					case 'R32': // if range is a weapon slot
					case 'R33': // ^^^
					case 'R34': // ^^^
					case 'R35': // ^^^
					case 'R36': // ^^^
						weapons(e) // run weapons(e)
						break

				}
				//weaponSwap(e)
				//notesSwap(e)
				break
			case 'Accounting': // if in Accounting sheet
				accounting(e) // run accounting(e)
				break
			default: // else
				if (sheetNames.includes(name)) spells(e) // run spells code if the current sheet is a spells sheet
				break
		}
	} else {
		switch (name) {
			case 'Character': // if in Character Sheet
				switch (a1) {
					case 'Z57': // if a1 corresponds to a features range
					case 'Z44': // ^^^
					case 'AH57': // ^^^
						features(e) // run features(e)
						break
					case 'R32': // if a1 corresponds to a weapons range
					case 'R33': // ^^^
					case 'R34': // ^^^
					case 'R35': // ^^^
					case 'R36': // ^^^
						weapons(e) // run weapons(e)
						break
					case 'AI31': // if a1 corresponds to armor cell
						armor(e) // run armor(e)
						break
					case 'T31': // if a1 corresponds to the weapon changer
						weaponSwap(e) // run weaponSwap(e)
						break
					case 'R43': // if a1 corresponds to the notes changer
						notesSwap(e) // run notesSwap(e)
						break
				}
				break
			case 'Accounting': // if in Accounting sheet
				accounting(e) // run accounting(e)
				break
			default: // else
				if (sheetNames.includes(name)) spells(e) // run spells(e) if current sheet is a spells sheet
				break
		}
	}
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnOpen} i 
 * @param {string} [id] 
 */
function preload(i, id) { //onOpen callbacks
	sideBar() // open sidebar
	version(i) // update version
	if (id == '1IOzfu9LPV-Vv3IJ3caolxHw-W1YJiyYAluXDfmbPiFs') jsonSwap({ source: i.source, value: "Page 1", oldValue: i.source.getRange('Character!T31').getValue(), range: i.source.getRange("Character!T31") })
}