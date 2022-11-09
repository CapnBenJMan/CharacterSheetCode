function coinClass() { // the source of the CoinSet class
	return class CoinSet { // returns the class
		constructor(platinum = 0, gold = 0, silver = 0, copper = 0, // constructor: coin values and change values can be 
			platChange = 0, goldChange = 0, silvChange = 0, coppChange = 0) { // manually inputted, but default to 0
			this.plat = { name: "Platinum", raw: platinum, mod: 1000, pts: platinum * 1000, change: platChange }
			// ^sets plat property to object with name, raw value, modifier, value in copper pieces, and whatever change may be present
			this.gold = { name: "Gold", raw: gold, mod: 100, pts: gold * 100, change: goldChange }
			// ^^^ but for gold
			this.silv = { name: "Silver", raw: silver, mod: 10, pts: silver * 10, change: silvChange }
			// ^^^ but for silver
			this.copp = { name: "Copper", raw: copper, mod: 1, pts: copper * 1, change: coppChange }
			// ^^^ but for copper
			this.points = this.plat.pts + this.gold.pts + this.silv.pts + this.copp.pts
			// ^sets points property equal to the sum of all the point values
			this.name = "CoinSet" // sets name property to "CoinSet"
		}
		/**
		 * @param {"plat"|"gold"|"silv"|"copp"} coin 
		 * @param {number} val 
		 */
		setRaw(coin, val) { // sets the raw value of a certain coin type
			const bool1 = (coin == "plat" || coin == "gold" || coin == "silv" || coin == "copp")
			// ^checks if coin equals plat, gold, silv, or copp
			const bool2 = typeof val == 'number' // checks if val is type Number
			try {
				if (bool1 && bool2) { // if bool1 and bool2 return true
					this[coin].raw = val // set raw value of the inputted coin type to val
					this.rawToPoints() // adjusts pts properties based on new raw values
					this.updatePoints() // adjust points property based on new point values
					return this // return this object
				} else throw '' // otherwise throw error
			} catch {
				const e = 'Error: ' + // error text defined with a series of ternaries
					bool1 ? '' : (`Param 'coin' must be equal to "plat", "gold", "silv", or "copp"; ` +
						`"${coin}" is not an acceptable value`) + // if bool1 returns false
						!bool1 && !bool2 ? ' and ' : '' + // if bool1 and bool2 return false
							bool2 ? '' : `Param 'val' is not a number` // if bool2 returns false
				console.error(e) // log the error
			}
		}
		/**
		 * @param {"plat"|"gold"|"silv"|"copp"} coin 
		 * @param {number} val 
		 */
		setPoints(coin, val) { // if bool1 and bool2 return true
			const bool1 = (coin == "plat" || coin == "gold" || coin == "silv" || coin == "copp")
			// ^checks if coin equals plat, gold, silv, or copp
			const bool2 = typeof val == 'number' // checks if val is type Number
			try {
				if (bool1 && bool2) { // if bool1 and bool2 return true
					this[coin].pts = val - (val % this[coin].mod)
					// ^set pts value of the inputted coin type to val rounded down to nearest coin value
					this.pointsToRaw() // adjusts raw properties based on new pts values
					this.updatePoints() // adjust points property based on new point values
					return this // return this object
				} else throw '' // otherwise throw error
			} catch (error) {
				const e = 'Error: ' + // error text defined with a series of ternaries
					bool1 ? '' : (`Param 'coin' must be equal to "plat", "gold", "silv", or "copp"; ` +
						`"${coin}" is not an acceptable value`) + // if bool1 returns false
						!bool1 && !bool2 ? ' and ' : '' + // if bool1 and bool2 return false
							bool2 ? '' : `Param 'val' is not a number` // if bool2 returns false
				console.error(e) // log the error
			}
		}
		/** @param {any[]} arr */
		setChange(arr = [, , ,]) {
			const [plat, gold, silv, copp] = [...Array(4)].map((x, i) => Boolean(arr[i]) ? Number(arr[i]) : 0)
			// ^define plat, gold, silv, and copp as numbers
			this.plat.change = plat // set change values accordingly
			this.gold.change = gold // ^^^
			this.silv.change = silv // ^^^
			this.copp.change = copp // ^^^
			return this // return this object
		}
		/** @param {{}|any[]} [container] */
		getRaw(container) { // get the raw values as either an object or array
			try {
				if (arguments.length > 0) { // if container is not undefined
					if (Array.isArray(container)) return [this.plat.raw, this.gold.raw,
					this.silv.raw, this.copp.raw]
					// ^if container is an array, return raw values in an array
					else if (typeof container == 'object') return {
						plat: this.plat.raw, gold: this.gold.raw,
						silv: this.silv.raw, copp: this.copp.raw
					} // else if container is an object, return raw values in an object
					else throw 'Error: Your container is not an object or array.'
					// ^else throw an error
				} else return [this.plat.raw, this.gold.raw, this.silv.raw, this.copp.raw]
				// ^else return raw values in array
			} catch (error) { console.error(error) } // log error
		}
		/** @param {{}|any[]} [container] */
		getPoints(container) { // get the pts values as either an object, array, or the total number
			try {
				if (arguments.length > 0) { // if container is not undefined
					if (Array.isArray(container)) return [this.plat.pts, this.gold.pts, this.silv.pts, this.copp.pts]
					// ^if container is an array, return pts values in an array
					else if (typeof container == 'object') return {
						plat: this.plat.pts, gold: this.gold.pts,
						silv: this.silv.pts, copp: this.copp.pts
					} // else if container is an object, return pts values in an object
					else throw 'Error: Your container is not an object or array.'
					// ^else throw an error
				} else return this.points // else return points property
			} catch (error) { console.error(error) } // log error
		}
		/** @param {{}|any[]} [container] */
		getChange(container) { // get the change values as either an object or array
			try {
				if (arguments.length > 0) { // if container is not undefined
					if (Array.isArray(container)) return [this.plat.change, this.gold.change, this.silv.change, this.copp.change]
					// ^if container is array, return change values in an array
					else if (typeof container == 'object') return {
						plat: this.plat.change, gold: this.gold.change,
						silv: this.silv.change, copp: this.copp.change
					} // else if container is an object, return change values in an object
					else throw 'Error: Your container is not an object or array.'
					// ^else throw error
				} else return [this.plat.change, this.gold.change, this.silv.change, this.copp.change]
				// ^else return change values in an array
			} catch (error) { console.error(error) } // log error
		}
		copy() { // create a copy of this coinset
			return new CoinSet( // returns a coinset with all of this object's current values
				this.plat.raw, this.gold.raw, this.silv.raw, this.copp.raw,
				this.plat.change, this.gold.change, this.silv.change, this.copp.change
			)
		}
		/**
		 * Returns a new CoinSet using the values from the container.
		 * If the container or changer is an array, it must be organized (from lowest index to highest)
		 * by Platinum, Gold, Silver, Copper, and it must have a length of 4.
		 * Otherwise, outputted object will not be what you want.
		 * If the container is an object, it should have the outlined parameters. 
		 * The parameters should be able to be coerced into numbers without throwing an error 
		 * (ex. "20" and 20 are both acceptable). Otherwise, all undefined values are set to 0.
		 * @param {{plat: any, gold: any, silv: any, copp: any} | any[]} container
		 * @param {{plat: any, gold: any, silv: any, copp: any} | any[]} [changer]
		 */
		static fromRaw(container, changer = [0, 0, 0, 0]) { // static method that takes 2 objects and creates a coinset from them
			try {
				const coinset = new CoinSet() // define new coinset
				const change = [] // define storage for change values
				if (!Array.isArray(changer) && typeof changer == 'object') for (const [_key, value] of Object.entries(changer)) change.push(Number(value))
				// ^if changer is not an array and changer is an object, loop through the entries and push them to change
				else changer.forEach(x => change.push(Number(x))) // otherwise loop through changer and push the values to change
				if (Array.isArray(container)) { // if container is array
					if (container.length == 4) { // and container length is 4
						coinset.plat.raw = Number(container[0] || 0) // set raw values of coinset
						coinset.gold.raw = Number(container[1] || 0) // ^^^
						coinset.silv.raw = Number(container[2] || 0) // ^^^
						coinset.copp.raw = Number(container[3] || 0) // ^^^
					} else {
						throw "The container array must have a length of 4" // otherwise throw error
					}
				} else { // else if container is object
					coinset.plat.raw = "plat" in container ? Number(container.plat) : 0 // set raw values of coinset
					coinset.gold.raw = "gold" in container ? Number(container.gold) : 0 // ^^^
					coinset.silv.raw = "silv" in container ? Number(container.silv) : 0 // ^^^
					coinset.copp.raw = "copp" in container ? Number(container.copp) : 0 // ^^^
				}
				coinset.plat.change = change[0] // set change for each coin type
				coinset.gold.change = change[1] // ^^^
				coinset.silv.change = change[2] // ^^^
				coinset.copp.change = change[3] // ^^^
				coinset.rawToPoints() // adjust pts based on raw values
				coinset.updatePoints() // update points based on new pts values
				return coinset // return the new coinset
			} catch (error) { console.error(error) } // log error
		}
		logVals() { // log the values of the coinset
			console.log({
				plat: this.plat,
				gold: this.gold,
				silv: this.silv,
				copp: this.copp,
				points: this.points
			})
		}
		applyChange() { // adds the change values to the raw values
			this.copp.raw += this.copp.change // applies the change
			this.silv.raw += this.silv.change // ^^^
			this.gold.raw += this.gold.change // ^^^
			this.plat.raw += this.plat.change // ^^^
			this.copp.change = 0 // resets change values to 0
			this.silv.change = 0 // ^^^
			this.gold.change = 0 // ^^^
			this.plat.change = 0 // ^^^
			this.rawToPoints() // adjust pts values based on new raw values
			this.updatePoints() // adjust points property based on new pts values
			return this // return this object
		}
		/**
		 * @param {number} platLMin
		 * @param {number} goldLMin
		 * @param {number} silvLMin
		 * @param {number} coppLMin
		 */
		distribute(coppLMin = 1, silvLMin = 1, goldLMin = 1, platLMin = 1) { // distributes coins so that there are no negative values
			try {
				const coppMin = arguments[0] === undefined || this.copp.raw < 0 ? 0 : 1
				// ^defines copper minimum as 0 or 1 depending on whether or not a value for copper was passed in the arguments or if
				// ^copper's raw value is less than 0 (those 2 yield 0, otherwise 1)
				const silvMin = arguments[1] === undefined || this.silv.raw < 0 ? 0 : 1 // ^^^
				const goldMin = arguments[2] === undefined || this.gold.raw < 0 ? 0 : 1 // ^^^
				const platMin = arguments[3] === undefined || this.plat.raw < 0 ? 0 : 1 // ^^^
				let checker = () => [ // checks if all the raw vals have enough digits and are a minimum value
					this.copp.raw.toString().length >= coppLMin && this.copp.raw >= coppMin,
					this.silv.raw.toString().length >= silvLMin && this.silv.raw >= silvMin,
					this.gold.raw.toString().length >= goldLMin && this.gold.raw >= goldMin,
					this.plat.raw.toString().length >= platLMin && this.plat.raw >= platMin
				].every(x => x === true)
				console.time('distribute') // time log
				const start = Date.now() // define start time
				if (this.points < 0) throw `Error: You don't have enough coin to complete this transaction.` +
					` You still need ${this.getFormattedPoints()} cp worth of coins to afford it.`
				// ^if coinset does not have enough points to be properly distributed, throw error
				while (true) { // keep looping until broken
					const bools = { // object for booleans of coin conversion compatibility
						copp: { // copper is able to be converted from...
							fromSilv: this.silv.raw > silvMin, // ...silver
							fromGold: this.gold.raw > goldMin, // ...gold
							fromPlat: this.plat.raw > platMin // ...platinum
						},
						silv: { // silver is able to be converted from...
							fromCopp: this.copp.raw > (9 + coppMin), // ...copper
							fromGold: this.gold.raw > goldMin, // ...gold
							fromPlat: this.plat.raw > platMin // ...platinum
						},
						gold: { // gold is able to be converted from...
							fromCopp: this.copp.raw > (99 + coppMin), // ...copper
							fromSilv: this.silv.raw > (9 + silvMin), // ...silver
							fromPlat: this.plat.raw > platMin // ...platinum
						},
						plat: { // platinum is able to be converted from...
							fromCopp: this.copp.raw > (999 + coppMin), // ...copper
							fromSilv: this.silv.raw > (99 + silvMin), // ...silver
							fromGold: this.gold.raw > (9 + goldMin) // ...gold
						}
					}
					const rawVals = [this.copp.raw, this.silv.raw, this.gold.raw, this.plat.raw]
					if (Date.now() - start > 1500 && rawVals.every(x => x >= 0)) throw 'time'
					// ^if time elapsed is less than 1.5s & raw values are all greater than or equal to 0

					// Copper Adjuster
					if (this.copp.raw.toString().length < coppLMin || this.copp.raw < coppMin) {
						// ^if copper doesn't have enough digits or is less than the minimum value
						if (bools.copp.fromSilv) { // if copper can be made from silver
							this.silv.raw -= 1 // make necessary adjustments
							this.silv.change -= 1 // ^^^
							this.copp.raw += 10 // ^^^
							this.copp.change += 10 // ^^^
							if (checker()) break // break if checker returns true
						} else if (bools.copp.fromGold) { // else if copper can be made from gold
							this.gold.raw -= 1 // make necessary adjustments
							this.gold.change -= 1 // ^^^
							this.copp.raw += 100 // ^^^
							this.copp.change += 100 // ^^^
							if (checker()) break // break if checker returns true
						} else if (bools.copp.fromPlat) { // else if copper can be made from platinum
							this.plat.raw -= 1 // make necessary adjustments
							this.plat.change -= 1 // ^^^
							this.copp.raw += 1000 // ^^^
							this.copp.change += 1000 // ^^^
							if (checker()) break // break if checker returns true
						}
					}

					// Silver Adjuster
					if (this.silv.raw.toString().length < silvLMin || this.silv.raw < silvMin) {
						// ^if silver doesn't have enough digits or is less than the minimum value
						if (bools.silv.fromGold) { // if silver can be made from gold
							this.gold.raw -= 1 // make necessary adjustments
							this.gold.change -= 1 // ^^^
							this.silv.raw += 10 // ^^^
							this.silv.change += 10 // ^^^
							if (checker()) break // break if checker returns true
						} else if (bools.silv.fromCopp) { // else if silver can be made from copper
							this.copp.raw -= 10 // make necessary adjustments
							this.copp.change -= 10 // ^^^
							this.silv.raw += 1 // ^^^
							this.silv.change += 1 // ^^^
							if (checker()) break // break if checker returns true
						} else if (bools.silv.fromPlat) { // else if silver can be made from platinum
							this.plat.raw -= 1 // make necessary adjustments
							this.plat.change -= 1 // ^^^
							this.silv.raw += 100 // ^^^
							this.silv.change += 100 // ^^^
							if (checker()) break // break if checker returns true
						}
					}

					// Gold Adjuster
					if (this.gold.raw.toString().length < goldLMin || this.gold.raw < goldMin) {
						// ^if gold doesn't have enough digits or is less than the minimum value
						if (bools.gold.fromPlat) { // if gold can be made from platinum
							this.plat.raw -= 1 // make necessary adjustments
							this.plat.change -= 1 // ^^^
							this.gold.raw += 10 // ^^^
							this.gold.change += 10 // ^^^
							if (checker()) break // break if checker returns true
						} else if (bools.gold.fromSilv) { // else if gold can be made from silver
							this.silv.raw -= 10 // make necessary adjustments
							this.silv.change -= 10 // ^^^
							this.gold.raw += 1 // ^^^
							this.gold.change += 1 // ^^^
							if (checker()) break // break if checker returns true
						} else if (bools.gold.fromCopp) { // else if gold can be made from copper
							this.copp.raw -= 100 // make necessary adjustments
							this.copp.change -= 100 // ^^^
							this.gold.raw += 1 // ^^^
							this.gold.change += 1 // ^^^
							if (checker()) break // break if checker returns true
						}
					}

					// Platinum Adjuster
					if (this.plat.raw.toString().length < platLMin || this.plat.raw < platMin) {
						// ^if platinum doesn't have enough digits or is less than the minimum value
						if (bools.plat.fromGold) { // if platinum can be made from gold
							this.gold.raw -= 10 // make necessary adjustments
							this.gold.change -= 10 // ^^^
							this.plat.raw += 1 // ^^^
							this.plat.change += 1 // ^^^
							if (checker()) break // break if checker returns true
						} else if (bools.plat.fromSilv) { // if platinum can be made from silver
							this.silv.raw -= 100 // make necessary adjustments
							this.silv.change -= 100 // ^^^
							this.plat.raw += 1 // ^^^
							this.plat.change += 1 // ^^^
							if (checker()) break // break if checker returns true
						} else if (bools.plat.fromCopp) { // if platinum can be made from copper
							this.copp.raw -= 1000 // make necessary adjustment
							this.copp.change -= 1000 // ^^^
							this.plat.raw += 1 // ^^^
							this.plat.change += 1 // ^^^
							if (checker()) break // break if checker returns true
						}
					}
				}
				this.rawToPoints() // adjust pts values to account for new raw values
				this.updatePoints() // update points property
				console.timeEnd('distribute') // end timelog
				return this // return this coinset
			} catch (err) {
				if (err == 'time') { console.warn('Either took too long or timed out intentionally') } // log warning
				else { console.error(err) } // otherwise log error
				console.timeEnd('distribute') // end timelog
				return this // return this coinset
			}
		}
		finalize() { // returns an object with only raw values of each coins
			return { plat: this.plat.raw, gold: this.gold.raw, silv: this.silv.raw, copp: this.copp.raw }
		}
		getFormattedPoints() { // return the formatted version of the number of points
			return Math.abs(this.points).toString().split('').reverse().join('').split(/(\d{3})/g).map(x => x.split('').reverse().join('')).filter(x => x != '').reverse().join(',')
		}
		rawToPoints() { // converts raw values to pts values
			for (let i in this) { // loop through coinset properties
				if (['points', 'name'].some(x => i == x)) continue // continue if current property is points or name
				this[i].pts = this[i].raw * this[i].mod // set pts value to raw value * mod
			}
		}
		pointsToRaw() { // converts pts values to raw values
			for (let i in this) { // loop through coinset properties
				if (['points', 'name'].some(x => i == x)) continue // continue if current property is points or name
				this[i].raw = this[i].pts / this[i].mod // set raw value to pts value / mod
			}
		}
		updatePoints() { // sets points property to the sum of each pts value
			this.points = this.plat.pts + this.gold.pts + this.silv.pts + this.copp.pts
		}
	}
}

function getCurrency() { // used to get the current values of the Accounting sheet
	const ss = SpreadsheetApp.getActiveSpreadsheet() // spreadsheet reference
	const accounting = ss.getSheetByName('Accounting') // accounting sheet reference
	return accounting.getRange('B3:E3').getValues()[0].map(x => Number(x)) // returns an array of numbers based on the current values
}

/** @param {number[]} arr */
function runManualDistributor(arr) { // used to set coin values manually
	const adjustment = getCurrency().map((x, i) => arr[i] - x)
	// ^calculates the adjustment required to get the manually adjusted values
	const accounting = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Accounting')
	// ^define reference to accounting sheet
	accounting.getRange('A4:E4').setValues([['Manual Adjustment', ...adjustment]]) // sets the adjustment values
	accounting.insertRowBefore(4) // insert row before 4
	accounting.getRange('B3:E3').setFormulas([['=SUM(B4:B)', '=SUM(C4:C)', '=SUM(D4:D)', '=SUM(E4:E)']]) // reset formulas
}