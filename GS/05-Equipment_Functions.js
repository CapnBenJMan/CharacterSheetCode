function equipmentInfo() { // returns all the equipment info formatted properly
	const raw = rawInfo() // define reference to object returned by raw info
	/** @param {string} m @param {string} n */
	let find = (m, n) => raw[m].find(x => x.Name == n) // define arrow function to return a searched object in raw
	return { // return the equipment packs combined with raw info in the same object
		"Equipment Pack": [
			{
				"Name": "Burglar's Pack",
				"Cost": "16 gp",
				"Note": "Backpack, a bag of 1,000 ball bearings, 10 feet of string, a bell, 5 candles, a crowbar, a hammer, 10 pitons, a hooded lantern, 2 flasks of oil, 5 days rations, a tinderbox and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.",
				"Quantity": "1",
				"Contents": [
					find("Containers", "Backpack"),
					find("Usable Items", "Ball Bearings (Bag Of 1,000)"),
					{ "Name": "String (10ft)", "Cost": "-", "Weight": "-", "Quantity": "1" },
					find("Common Item", "Bell"),
					{ ...find("Common Item", "Candle"), "Quantity": "5" },
					find("Usable Items", "Crowbar"),
					find("Common Item", "Hammer"),
					{ ...find("Common Item", "Piton"), "Quantity": "5" },
					find("Usable Items", "Lantern - Hooded"),
					{ ...find("Usable Items", "Oil (Flask)"), "Quantity": "2" },
					{ ...find("Common Item", "Rations (1 Day)"), "Quantity": "5" },
					find("Usable Items", "Tinderbox"),
					find("Containers", "Waterskin"),
					find("Common Item", "Rope, Hempen")
				]
			},
			{
				"Name": "Diplomat's Pack",
				"Cost": "39 gp",
				"Note": "Chest, 2 cases for maps and scrolls, a set of fine clothes, a bottle of ink, an ink pen, a lamp, 2 flasks of oil, 5 sheets of paper, a vial of perfume, sealing wax, and soap.",
				"Quantity": "1",
				"Contents": [
					find("Containers", "Chest"),
					{ ...find("Containers", "Case, Map/Scroll"), "Quantity": "2" },
					find("Clothes", "Fine Clothes"),
					find("Common Item", "Ink (1 Oz)"),
					find("Common Item", "Ink Pen"),
					find("Usable Items", "Lamp"),
					{ ...find("Usable Items", "Oil (Flask)"), "Quantity": "2" },
					{ ...find("Common Item", "Paper (1 Sheet)"), "Quantity": "5" },
					find("Common Item", "Perfume (Vial)"),
					find("Common Item", "Sealing Wax"),
					find("Common Item", "Soap")
				]
			},
			{
				"Name": "Dungeoneer's Pack",
				"Cost": "12 gp",
				"Note": "Backpack, a crowbar, a hammer, 10 pitons, 10 torches, a tinderbox, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.",
				"Quantity": "1",
				"Contents": [
					find("Containers", "Backpack"),
					find("Usable Items", "Crowbar"),
					find("Common Item", "Hammer"),
					{ ...find("Common Item", "Piton"), "Quantity": "10" },
					{ ...find("Usable Items", "Torch"), "Quantity": "10" },
					{ ...find("Common Item", "Rations (1 Day)"), "Quantity": "10" },
					find("Containers", "Waterskin"),
					find("Common Item", "Rope, Hempen")
				]
			},
			{
				"Name": "Entertainer's Pack",
				"Cost": "40 gp",
				"Note": "Backpack, a bedroll, 2 costumes, 5 candles, 5 days of rations, a waterskin, and a disguise kit.",
				"Quantity": "1",
				"Contents": [
					find("Containers", "Backpack"),
					find("Common Item", "Bedroll"),
					{ ...find("Clothes", "Costume"), "Quantity": "2" },
					{ ...find("Common Item", "Candle"), "Quantity": "5" },
					{ ...find("Common Item", "Rations (1 Day)"), "Quantity": "5" },
					find("Containers", "Waterskin"),
					find("Tool Set", "Disguise Kit")
				]
			},
			{
				"Name": "Explorer's Pack",
				"Cost": "10 gp",
				"Note": "Backpack, a bedroll, a mess kit, a tinderbox, 10 torches, 10 days of rations, and a waterskin. The pack also has 50 feet of hempen rope strapped to the side of it.",
				"Quantity": "1",
				"Contents": [
					find("Containers", "Backpack"),
					find("Common Item", "Bedroll"),
					find("Usable Items", "Tinderbox"),
					{ ...find("Usable Items", "Torch"), "Quantity": "10" },
					{ ...find("Common Item", "Rations (1 Day)"), "Quantity": "10" },
					find("Containers", "Waterskin"),
					find("Common Item", "Rope, Hempen")
				]
			},
			{
				"Name": "Priest's Pack",
				"Cost": "19 gp",
				"Note": "Backpack, a blanket, 10 candles, a tinderbox, an alms box, 2 blocks of incense, a censer, vestments, 2 days of rations, and a waterskin.",
				"Quantity": "1",
				"Contents": [
					find("Containers", "Backpack"),
					find("Common Item", "Blanket"),
					{ ...find("Common Item", "Candle"), "Quantity": "10" },
					find("Usable Items", "Tinderbox"),
					{ "Name": "Alms Box", "Cost": "-", "Weight": "-", "Quantity": "1" },
					{ "Name": "Block of Incense", "Cost": "-", "Weight": "-", "Quantity": "2" },
					{ "Name": "Censer", "Cost": "-", "Weight": "-", "Quantity": "1" },
					{ "Name": "Vestments", "Cost": "-", "Weight": "-", "Quantity": "1" },
					{ ...find("Common Item", "Rations (1 Day)"), "Quantity": "2" },
					find("Containers", "Waterskin")
				]
			},
			{
				"Name": "Scholar's Pack",
				"Cost": "40 gp",
				"Note": "Backpack, a book of lore, a bottle of ink, an ink pen, 10 sheets of parchment, a little bag of sand, and a small knife.",
				"Quantity": "1",
				"Contents": [
					find("Containers", "Backpack"),
					{...find("Common Item", "Book"), "Name": "Book of Lore"},
					find("Common Item", "Ink (1 Oz)"),
					find("Common Item", "Ink Pen"),
					{ ...find("Common Item", "Parchment (1 Sheet)"), "Quantity": "10" },
					{ "Name": "Bag of Sand", "Cost": "-", "Weight": "-", "Quantity": "1" },
					find("Weapons", "Dagger")
				]
			}
		],
		...raw
	}
}

function rawInfo() { // returns all the items present here sorted by category
	return {
		"Common Item": [
			{
				"Name": "Abacus", // obj["Common Item"][0]["Name"]
				"Cost": "2 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Bedroll",
				"Cost": "1 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Bell",
				"Cost": "1 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Blanket",
				"Cost": "5 sp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Block And Tackle",
				"Cost": "1 gp",
				"Weight": "5 lbs",
				"Note": "A set of pulleys with a cable threaded through them and a hook to attach to objects, a block and tackle allows you to hoist up to four times the weight you can normally lift.",
				"Quantity": "1"
			},
			{
				"Name": "Book",
				"Cost": "25 gp",
				"Weight": "5 lbs",
				"Note": "A book might contain poetry, historical accounts, information pertaining to a particular field of lore, diagrams and notes on gnomish contraptions, or just about anything else that can be represented sing text or pictures. A book of spells is a spellbook.",
				"Quantity": "1"
			},
			{
				"Name": "Candle",
				"Cost": "1 cp",
				"Weight": "-",
				"Note": "For 1 hour, a candle sheds bright light in a 5-foot radius and dim light for another 5 feet.",
				"Quantity": "1"
			},
			{
				"Name": "Chain (10 Ft)",
				"Cost": "5 gp",
				"Weight": "10 lbs",
				"Note": "A chain has 10 hit points. It can be burst with a successful DC 20 Strength check.",
				"Quantity": "1"
			},
			{
				"Name": "Chalk (1 Pc)",
				"Cost": "1 cp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Component Pouch",
				"Cost": "25 gp",
				"Weight": "2 lbs",
				"Note": "A component pouch is a small, watertight leather belt pouch that has compartments to hold all the material components and other special items you need to cast your spells, except for those components that have a specific cost (as indicated in a spell's description).",
				"Quantity": "1"
			},
			{
				"Name": "Fishing Tackle",
				"Cost": "1 gp",
				"Weight": "4 lbs",
				"Note": "This kit includes a wooden rod, silken line, corkwood bobbers, steel hooks, lead sinkers, velvet lures, and narrow netting.",
				"Quantity": "1"
			},
			{
				"Name": "Grappling Hook",
				"Cost": "2 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Hammer",
				"Cost": "1 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Hourglass",
				"Cost": "25 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Ink (1 Oz)",
				"Cost": "10 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Ink Pen",
				"Cost": "2 cp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Ladder (10 Ft)",
				"Cost": "1 sp",
				"Weight": "25 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Lock",
				"Cost": "10 gp",
				"Weight": "1 lbs",
				"Note": "A key is provided with the lock. Without the key, a creature proficient with thieves' tools can pick this lock with a successful DC 15 Dexterity check. Your DM may decide that better locks are available for higher prices.",
				"Quantity": "1"
			},
			{
				"Name": "Magnifying Glass",
				"Cost": "100 gp",
				"Weight": "-",
				"Note": "This lens allows a closer look at small objects. It is also useful as a substitute or flint and steel when starting fires. Lighting a fire with a magnifying glass requires light as bright as sunlight to focus, tinder to ignite, and about 5 minutes for the fire to ignite. A magnifying glass grants advantage on any ability check made to appraise or inspect an item that is small or highly detailed.",
				"Quantity": "1"
			},
			{
				"Name": "Mess Kit",
				"Cost": "2 sp",
				"Weight": "1 lbs",
				"Note": "This tin box contains a cup and simple cutlery. The box clamps together, and one side can be used as a cooking pan and the other as a plate or shallow bowl.",
				"Quantity": "1"
			},
			{
				"Name": "Miner's Pick",
				"Cost": "2 gp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Paper (1 Sheet)",
				"Cost": "2 sp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Parchment (1 Sheet)",
				"Cost": "1 sp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Perfume (Vial)",
				"Cost": "5 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Piton",
				"Cost": "5 cp",
				"Weight": "0.25 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Pole (10 Ft)",
				"Cost": "5 cp",
				"Weight": "7 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Rations (1 Day)",
				"Cost": "5 sp",
				"Weight": "2 lbs",
				"Note": "Rations consist of dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts.",
				"Quantity": "1"
			},
			{
				"Name": "Rope, Hempen",
				"Cost": "1 gp",
				"Weight": "10 lbs",
				"Note": "Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.",
				"Quantity": "1"
			},
			{
				"Name": "Rope, Silk",
				"Cost": "10 gp",
				"Weight": "5 lbs",
				"Note": "Rope, whether made of hemp or silk, has 2 hit points and can be burst with a DC 17 Strength check.",
				"Quantity": "1"
			},
			{
				"Name": "Sealing Wax",
				"Cost": "5 sp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Shovel",
				"Cost": "2 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Signal Whistle",
				"Cost": "5 cp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Signet Ring",
				"Cost": "5 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Sledgehammer",
				"Cost": "2 gp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Soap",
				"Cost": "2 cp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Spellbook",
				"Cost": "50 gp",
				"Weight": "3 lbs",
				"Note": "Essential for wizards, a spellbook is a leather-bound tome with 100 blank vellum pages suitable for recording spells.",
				"Quantity": "1"
			},
			{
				"Name": "Spikes - Iron",
				"Cost": "1 gp",
				"Weight": "5 lbs",
				"Quantity": "10"
			},
			{
				"Name": "Spyglass",
				"Cost": "1000 gp",
				"Weight": "1 lbs",
				"Note": "Objects viewed through a spyglass are magnified to twice their size.",
				"Quantity": "1"
			},
			{
				"Name": "Tent - 2 Person",
				"Cost": "2 gp",
				"Weight": "20 lbs.",
				"Quantity": "1"
			},
			{
				"Name": "Whetstone",
				"Cost": "1 cp",
				"Weight": "1 lbs",
				"Quantity": "1"
			}
		],
		"Usable Items": [
			{
				"Name": "Acid (Vial)",
				"Cost": "25 gp",
				"Weight": "1 lbs",
				"Note": "As an action, you can splash the contents of this vial onto a creature within 5 feet of you or throw the vial up to 20 feet, shattering it on impact. In either case, make a ranged attack against a creature or object, treating the acid as an improvised weapon. On a hit, the target takes 2d6 acid damage.",
				"Quantity": "1"
			},
			{
				"Name": "Alchemist's Fire (Flask)",
				"Cost": "50 gp",
				"Weight": "1 lbs",
				"Note": "This sticky, adhesive fluid ignites when exposed to air. As an action, you can throw this flask up to 20 feet, shattering it on impact. Make a ranged attack against a creature or object, treating the alchemist's fire as an improvised weapon. On a hit, the target takes 1d4 fire damage at the start of each of its turns. A creature can end this damage by using its action to make a DC 10 Dexterity check to extinguish the flames.",
				"Quantity": "1"
			},
			{
				"Name": "Antitoxin (Vial)",
				"Cost": "50 gp",
				"Weight": "-",
				"Note": "A creature that drinks this vial of liquid gains advantage on saving throws against poison for 1 hour. It confers no benefits to undead or constructs.",
				"Quantity": "1"
			},
			{
				"Name": "Ball Bearings (Bag Of 1,000)",
				"Cost": "1 gp",
				"Weight": "2 lbs",
				"Note": "As an action, you can spill these tiny balls from their pouch to cover a level area 10 feet square. A creature moving across the covered area must succeed on a DC 10 Dexterity saving throw or all prone. A creature moving through the area at half speed doesn't need to make the saving throw.",
				"Quantity": "1"
			},
			{
				"Name": "Caltrops (Bag Of 20)",
				"Cost": "1 gp",
				"Weight": "2 lbs",
				"Note": "As an action, you can spread a single bag of caltrops to cover a 5-foot-square area. Any creature that enters the area must succeed on a DC 15 Dexterity saving throw or stop moving and take 1 piercing damage. Until the creature regains at least 1 hit point, its walking speed is reduced by 10 feet. A creature moving through the area at half speed doesn't need to make the saving throw.",
				"Quantity": "1"
			},
			{
				"Name": "Climber's Kit",
				"Cost": "25 gp",
				"Weight": "12 lbs",
				"Note": "A climber's kit includes special pitons, boot tips, gloves, and a harness. You can use the climber's kit as an action to anchor yourself; when you do, you can't fall more than 25 feet from the point where you anchored yourself, and you can't climb more than 25 feet away from that point without undoing the anchor.",
				"Quantity": "1"
			},
			{
				"Name": "Crowbar",
				"Cost": "2 gp",
				"Weight": "5 lbs",
				"Note": "Using a crowbar grants advantage to Strength checks where the crowbar's leverage can be applied.",
				"Quantity": "1"
			},
			{
				"Name": "Healer's Kit",
				"Cost": "5 gp",
				"Weight": "3 lbs",
				"Note": "This kit is a leather pouch containing bandages, salves, and splints. The kit has ten uses. As an action, you can expend one use of the kit to stabilize a creature that has 0 hit points, without needing to make a Wisdom (Medicine) check.",
				"Quantity": "1"
			},
			{
				"Name": "Holy Water (Flask)",
				"Cost": "25 gp",
				"Weight": "1 lbs",
				"Note": "As an action, you can splash the contents of this flask onto a creature within 5 feet of you or throw it up to 20 feet, shattering it on impact. In either case, make a ranged attack against a target creature, treating the holy water as an improvised weapon. If the target is a fiend or undead, it takes 2d6 radiant damage.",
				"Quantity": "1"
			},
			{
				"Name": "Hunting Trap",
				"Cost": "5 gp",
				"Weight": "25 lbs",
				"Note": "When you use your action to set it, this trap forms a saw-toothed steel ring that snaps shut when a creature steps on a pressure plate in the center. The trap is affixed by a heavy chain to an immobile object, such as a tree or a spike driven into the ground. A creature that steps on the plate must succeed on a DC 13 Dexterity saving throw or take 1d4 piercing damage and stop moving. Thereafter, until the creature breaks free of the trap, its movement is limited by the length of chain (typically 3 feet long). A creature can use its action to make a DC 13 Strength check, freeing itself or another creature within its reach on a success. Each failed check deals 1 piercing damage to the trapped creature.",
				"Quantity": "1"
			},
			{
				"Name": "Lamp",
				"Cost": "5 sp",
				"Weight": "1 lbs",
				"Note": "A lamp casts bright light in a 15-foot radius and dim light for an additional 30 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil.",
				"Quantity": "1"
			},
			{
				"Name": "Lantern - Bullseye",
				"Cost": "10 gp",
				"Weight": "2 lbs",
				"Note": "A bullseye lantern casts bright light in a 60-foot cone and dim light for an additional 60 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil.",
				"Quantity": "1"
			},
			{
				"Name": "Lantern - Hooded",
				"Cost": "5 gp",
				"Weight": "2 lbs",
				"Note": "A hooded lantern casts bright light in a 30-foot radius and dim light for an additional 30 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil. As an action, you can lower the hood, reducing the light to dim light in a 5-foot radius.",
				"Quantity": "1"
			},
			{
				"Name": "Oil (Flask)",
				"Cost": "1 sp",
				"Weight": "1 lbs",
				"Note": "Oil usually comes in a clay flask that holds 1 pint. As an action, you can splash the oil in this flask onto a creature within 5 feet of you or throw it up to 20 feet, shattering it on impact. Make a ranged attack against a target creature or object, treating the oil as an improvised weapon. On a hit, the target is covered in oil. If the target takes any fire damage before the oil dries (after 1 minute), the target takes an additional 5 fire damage from the burning oil. You can also pour a flask of oil on the ground to cover a 5-foot-square area, provided that the surface is level. if lit, the oil burns for 2 rounds and deals 5 fire damage to any creature that enters the area or ends its turn in the area. A creature can take this damage only once per turn.",
				"Quantity": "1"
			},
			{
				"Name": "Poison, Basic (Vial)",
				"Cost": "100 gp",
				"Weight": "-",
				"Note": "You can use the poison in this vial to coat one slashing or piercing weapon or up to three pieces of ammunition. Applying the poison takes an action. A creature hit by the poisoned weapon or ammunition must make a DC 10 Constitution saving throw or take 1d4 poison damage. Once applied, the poison retains potency for 1 minute before drying.",
				"Quantity": "1"
			},
			{
				"Name": "Potion Of Healing (Common)",
				"Cost": "50 gp",
				"Weight": "0.5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Tinderbox",
				"Cost": "5 sp",
				"Weight": "1 lbs",
				"Note": "This small container holds flint, fire steel, an tinder (usually dry cloth soaked in light oil) used to kindle a fire. Using it to light a torch — or anything else with abundant, exposed fuel — takes an action. Lighting any other fire takes 1 minutes.",
				"Quantity": "1"
			},
			{
				"Name": "Torch",
				"Cost": "1 cp",
				"Weight": "1 lbs",
				"Note": "A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet. If you make a melee attack with a burning torch and hit, it deals 1 fire damage.",
				"Quantity": "1"
			}
		],
		"Clothes": [
			{
				"Name": "Common Clothes",
				"Cost": "5 sp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Costume",
				"Cost": "5 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Fine Clothes",
				"Cost": "15 gp",
				"Weight": "6 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Robes",
				"Cost": "1 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Traveler's Clothes",
				"Cost": "2 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			}
		],
		"Arcane Focus": [
			{
				"Name": "Crystal",
				"Cost": "10 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Orb",
				"Cost": "20 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Rod",
				"Cost": "10 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Staff",
				"Cost": "5 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Wand",
				"Cost": "10 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			}
		],
		"Druidic Focus": [
			{
				"Name": "Sprig Of Mistletoe",
				"Cost": "1 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Totem",
				"Cost": "1 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Wooden Staff",
				"Cost": "5 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Yew Wand",
				"Cost": "10 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			}
		],
		"Holy Symbols": [
			{
				"Name": "Amulet",
				"Cost": "5 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Emblem",
				"Cost": "5 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Reliquary",
				"Cost": "5 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			}
		],
		"Containers": [
			{
				"Name": "Backpack",
				"Cost": "2 gp",
				"Weight": "5 lbs",
				"Note": "You can also strap items, such as a bedroll or a coil of rope, to the outside of a backpack.",
				"Quantity": "1"
			},
			{
				"Name": "Barrel",
				"Cost": "2 gp",
				"Weight": "70 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Basket",
				"Cost": "4 sp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Bucket",
				"Cost": "5 cp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Case, Crossbow Bolt",
				"Cost": "1 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Case, Map/Scroll",
				"Cost": "1 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Chest",
				"Cost": "5 gp",
				"Weight": "25 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Flask Or Tankard",
				"Cost": "2 cp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Glass Bottle",
				"Cost": "2 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Jug Or Pitcher",
				"Cost": "2 cp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Pot, Iron",
				"Cost": "2 gp",
				"Weight": "10 lb",
				"Quantity": "1"
			},
			{
				"Name": "Pouch",
				"Cost": "5 sp",
				"Weight": "1 lbs",
				"Note": "A cloth or leather pouch can hold up to 20 sling bullets or 50 blowgun needles, among other things. A compartmentalized pouch for holding spell components is called a component pouch.",
				"Quantity": "1"
			},
			{
				"Name": "Quiver",
				"Cost": "1 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Sack",
				"Cost": "1 cp",
				"Weight": "0.5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Vial",
				"Cost": "1 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Waterskin",
				"Cost": "2 sp",
				"Weight": "5 lbs(full)",
				"Quantity": "1"
			}
		],
		"Armor": [
			{
				"Name": "Padded Armor",
				"Weight": "8 lbs",
				"Cost": "5 gp",
				"Quantity": "1"
			},
			{
				"Name": "Leather Armor",
				"Weight": "10 lbs",
				"Cost": "10 gp",
				"Quantity": "1"
			},
			{
				"Name": "Studded Leather Armor",
				"Weight": "13 lbs",
				"Cost": "45 gp",
				"Quantity": "1"
			},
			{
				"Name": "Hide Armor",
				"Weight": "12 lbs",
				"Cost": "10 gp",
				"Quantity": "1"
			},
			{
				"Name": "Chain Shirt",
				"Weight": "20 lbs",
				"Cost": "50 gp",
				"Quantity": "1"
			},
			{
				"Name": "Scale Mail",
				"Weight": "45 lbs",
				"Cost": "50 gp",
				"Quantity": "1"
			},
			{
				"Name": "Spiked Armor",
				"Weight": "45 lbs",
				"Cost": "75 gp",
				"Quantity": "1"
			},
			{
				"Name": "Breastplate",
				"Weight": "20 lbs",
				"Cost": "400 gp",
				"Quantity": "1"
			},
			{
				"Name": "Halfplate",
				"Weight": "40 lbs",
				"Cost": "750 gp",
				"Quantity": "1"
			},
			{
				"Name": "Ring Mail",
				"Weight": "40 lbs",
				"Cost": "30 gp",
				"Quantity": "1"
			},
			{
				"Name": "Chain Mail",
				"Weight": "55 lbs",
				"Cost": "75 gp",
				"Quantity": "1"
			},
			{
				"Name": "Splint",
				"Weight": "60 lbs",
				"Cost": "200 gp",
				"Quantity": "1"
			},
			{
				"Name": "Plate",
				"Weight": "65 lbs",
				"Cost": "1,500 gp",
				"Quantity": "1"
			},
			{
				"Name": "Shield",
				"Weight": "6 lbs",
				"Cost": "10 gp",
				"Quantity": "1"
			}
		],
		"Explosives": [
			{
				"Name": "Bomb",
				"Cost": "150gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Gunpowder, Keg",
				"Cost": "250gp",
				"Weight": "20 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Gunpowder, Powder Horn",
				"Cost": "35gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Dynamite (Stick)",
				"Cost": "-",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Grenade, Fragmentation",
				"Cost": "-",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Grenade, Smoke",
				"Cost": "-",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Grenade Launcher",
				"Cost": "-",
				"Weight": "7 lbs",
				"Quantity": "1"
			}
		],
		"Firearms (DMG)": [
			{
				"Name": "Pistol (Renaissance)",
				"Cost": "250 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Musket (Renaissance)",
				"Cost": "500 gp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Pistol, Automatic (Modern)",
				"Cost": "-",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Revolver (Modern)",
				"Cost": "-",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Rifle, Hunting (Modern)",
				"Cost": "-",
				"Weight": "8 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Rifle, Automatic (Modern)",
				"Cost": "-",
				"Weight": "8 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Shotgun (Modern)",
				"Cost": "-",
				"Weight": "7 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Laser Pistol (Futuristic)",
				"Cost": "-",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Antimatter Rifle (Futuristic)",
				"Cost": "-",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Laser Rifle (Futuristic)",
				"Cost": "-",
				"Weight": "7 lbs",
				"Quantity": "1"
			}
		],
		"Firearms (Exandria)": [
			{
				"Name": "Palm Pistol (Exandria)",
				"Cost": "50 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Pistol (Exandria)",
				"Cost": "150 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Musket (Exandria)",
				"Cost": "300 gp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Pepperbox (Exandria)",
				"Cost": "250 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Blunderbuss (Exandria)",
				"Cost": "300 gp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Bad News (Exandria)",
				"Cost": "Crafted",
				"Weight": "25 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Hand Mortar (Exandria)",
				"Cost": "Crafted",
				"Weight": "10 lbs",
				"Quantity": "1"
			}
		],
		"Tool Set": [
			{
				"Name": "Alchemist's Supplies",
				"Cost": "50 gp",
				"Weight": "8 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Brewer's Supplies",
				"Cost": "20 gp",
				"Weight": "9 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Calligrapher's Supplies",
				"Cost": "10 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Carpenter's Tools",
				"Cost": "8 gp",
				"Weight": "6 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Cartographer's Tools",
				"Cost": "15 gp",
				"Weight": "6 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Cobbler's Tools",
				"Cost": "5 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Cook's Utensils",
				"Cost": "1 gp",
				"Weight": "8 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Glassblower's Tools",
				"Cost": "30 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Jeweler's Tools",
				"Cost": "25 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Leatherworker's Tools",
				"Cost": "5 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Mason's Tools",
				"Cost": "10 gp",
				"Weight": "8 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Painter's Supplies",
				"Cost": "10 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Potter's Tools",
				"Cost": "10 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Smith's Tools",
				"Cost": "20 gp",
				"Weight": "8 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Tinker's Tools",
				"Cost": "50 gp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Weaver's Tools",
				"Cost": "1 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Woodcarver's Tools",
				"Cost": "1 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Dice Set",
				"Cost": "1 sp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Dragonchess Set",
				"Cost": "1 gp",
				"Weight": "1/2 lb",
				"Quantity": "1"
			},
			{
				"Name": "Playing Card Set",
				"Cost": "5 sp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Three-Dragon Ante Set",
				"Cost": "1 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Bagpipes",
				"Cost": "30 gp",
				"Weight": "6 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Drum",
				"Cost": "6 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Dulcimer",
				"Cost": "25 gp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Flute",
				"Cost": "2 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Lute",
				"Cost": "35 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Lyre",
				"Cost": "30 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Horn",
				"Cost": "3 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Pan Flute",
				"Cost": "12 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Shawm",
				"Cost": "2 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Viol",
				"Cost": "30 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Disguise Kit",
				"Cost": "25 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Forgery Kit",
				"Cost": "15 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Herbalism Kit",
				"Cost": "5 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Navigator's Tools",
				"Cost": "25 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Poisoner's Kit",
				"Cost": "50 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Thieves' Tools",
				"Cost": "25 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			}
		],
		"Weapons": [
			{
				"Name": "Club",
				"Cost": "1 sp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Dagger",
				"Cost": "2 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Great-Club",
				"Cost": "2 sp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Hand-Axe",
				"Cost": "5 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Javelin",
				"Cost": "5 sp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Light Hammer",
				"Cost": "2 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Mace",
				"Cost": "5 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Quarterstaff",
				"Cost": "2 sp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Sickle",
				"Cost": "1 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Spear",
				"Cost": "1 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Crossbow, Light",
				"Cost": "25 gp",
				"Weight": "5 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Dart",
				"Cost": "5 cp",
				"Weight": "1/4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Shortbow",
				"Cost": "25 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Sling",
				"Cost": "1 sp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Battleaxe",
				"Cost": "10 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Flail",
				"Cost": "10 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Glaive",
				"Cost": "20 gp",
				"Weight": "6 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Greataxe",
				"Cost": "30 gp",
				"Weight": "7 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Great-Sword",
				"Cost": "50 gp",
				"Weight": "6 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Halberd",
				"Cost": "20 gp",
				"Weight": "6 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Lance",
				"Cost": "10 gp",
				"Weight": "6 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Long-Sword",
				"Cost": "15 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Maul",
				"Cost": "10 gp",
				"Weight": "10 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Morning-Star",
				"Cost": "15 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Pike",
				"Cost": "5 gp",
				"Weight": "18 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Rapier",
				"Cost": "25 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Scimitar",
				"Cost": "25 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Short-Sword",
				"Cost": "10 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Trident",
				"Cost": "5 gp",
				"Weight": "4 lbs",
				"Quantity": "1"
			},
			{
				"Name": "War Pick",
				"Cost": "5 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "War-Hammer",
				"Cost": "15 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Whip",
				"Cost": "2 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Blowgun",
				"Cost": "10 gp",
				"Weight": "1 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Crossbow, Hand",
				"Cost": "75 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Crossbow, Heavy",
				"Cost": "50 gp",
				"Weight": "18 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Longbow",
				"Cost": "50 gp",
				"Weight": "2 lbs",
				"Quantity": "1"
			},
			{
				"Name": "Net",
				"Cost": "1 gp",
				"Weight": "3 lbs",
				"Quantity": "1"
			}
		],
		"Ammunition": [
			{
				"Name": "Arrows",
				"Cost": "5 cp", // per 1
				"Weight": "1/20 lbs",
				"Quantity": "20"
			},
			{
				"Name": "Blowgun Needles",
				"Cost": "2 cp", // per 1
				"Weight": "1/50 lbs",
				"Quantity": "50"
			},
			{
				"Name": "Crossbow Bolts",
				"Cost": "5 cp", // per 1
				"Weight": "1.5/20 lbs",
				"Quantity": "20"
			},
			{
				"Name": "Sling Bullets",
				"Cost": "0.1 cp", // per 1
				"Weight": "1.5/20 lbs",
				"Quantity": "20"
			},
			{
				"Name": "Palm Pistol Ammo (Exandria)",
				"Cost": "1 sp", // per 1
				"Weight": "-",
				"Quantity": "20"
			},
			{
				"Name": "Pistol Ammo (Exandria)",
				"Cost": "2 sp", // per 1
				"Weight": "-",
				"Quantity": "20"
			},
			{
				"Name": "Musket Ammo (Exandria)",
				"Cost": "25 cp", // per 1
				"Weight": "-",
				"Quantity": "20"
			},
			{
				"Name": "Pepperbox Ammo (Exandria)",
				"Cost": "2 sp", // per 1
				"Weight": "-",
				"Quantity": "20"
			},
			{
				"Name": "Blunderbuss Ammo (Exandria)",
				"Cost": "1 gp", // per 1
				"Weight": "-",
				"Quantity": "5"
			},
			{
				"Name": "Bad News Ammo (Exandria)",
				"Cost": "2 gp", // per 1
				"Weight": "-",
				"Quantity": "5"
			},
			{
				"Name": "Hand Mortar Ammo (Exandria)",
				"Cost": "10 gp",
				"Weight": "-",
				"Quantity": "1"
			},
			{
				"Name": "Bullets (Renaissance)",
				"Cost": "3gp",
				"Weight": "2 lbs",
				"Quantity": "10"
			},
			{
				"Name": "Bullets (Modern)",
				"Cost": "-",
				"Weight": "1 lbs",
				"Quantity": "10"
			},
			{
				"Name": "Energy Cell (Futuristic)",
				"Cost": "-",
				"Weight": "5/16 lbs",
				"Quantity": "1"
			}
		]
	}
}