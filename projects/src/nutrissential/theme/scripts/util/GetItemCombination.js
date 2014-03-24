/*=======================================================================
GetItemCombination.js - method for building item combination per game
 *  @return [Object] collections of item Object
 *	@param [String] url  file url of item list in json format
 *	@param [String] sp	file url of spawnpoints list in json format

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Joerian Gauten
07.19.2012
========================================================================*/
var ItemCombination = (function() {

	$.ajaxSetup({
		dataType: "json",
		async: false
	});


	var getCombination = function(url, sp) {

		// array holder of items combinations
		var combinations = {};

		// json parser for item data
		$.ajax({

			url: url,
			success : function(data) {

				var items = [],
					foodGroup;

				// loop each foodGroup
				for ( foodGroup in data ) {

					// item data variables
					var dataItem,
						itemId,
						score,
						timeBonus;

					// to prevent item to appear more than once
					do {

						var pos = Math.floor( Math.random() * data[foodGroup].length ),
							item = data[foodGroup][pos];

						dataItem = item.name;

					} while ( items.indexOf(dataItem) != -1 );

					// push the item to the items array for duplicate items checking
					items.push(dataItem);

					// set score
					score = item.score;

					// set timeBonus
					timeBonus = item.time;

					/**
					 *	process item name to have suffixed with food group
					 *	then eliminate spaces and make sure it is in lower case
					 */
					itemId = foodGroup + "_" + dataItem;
					itemId = itemId.toLowerCase().replace(/\s/,"");

					// build the item object
					combinations[itemId] = {
						"desc" : item.desc,
						"ref" : item.ref,
						"avatar" : itemId + "-avatar",
						"icon" : itemId + "-icon",
						"piece" : itemId + "-piece",
						"score" : score,
						"timeBonus" : timeBonus
					};

				} // end of for loop

			},

			error : function(error) {

				combinations = ["Error in AJAX", error.statusText, error.status, error];

			}

		});
		
		// return new object after stack count is added to each items
		return setStackCount(combinations, sp);

	} // end of get itemData


	/**
	 *	method for adding stack count
	 *	@return [Object] collection of item Object with stack property
	 *	@param [Object] data  Object of items Object
	 *	@param [String] sp	file url of spawnpoints list in json format
	 */
	var setStackCount = function(data, sp) {

		var spawnPoints,
			maxSpawnPoints,
			takenSlot = [],
			stack,
			items = [],
			itemCount = 0,
			stackDiff = 0;

		for ( var prop in data ) if( data.hasOwnProperty(prop) ) itemCount++;

		// get the spawn points data
		$.getJSON(sp, function(data) { spawnPoints = data; maxSpawnPoints = spawnPoints.length; });


		while ( maxSpawnPoints%itemCount ) {

			maxSpawnPoints--;
			stackDiff++;

		}

		stack = maxSpawnPoints / itemCount;

		for ( var itemName in data ) {

			var item = data[itemName],
				stackCount = stack,
				points = [];

			items.push(itemName);

			item.stack = stack;

			while ( stackCount-- ) {

				do {
				
					var randPos = Math.floor( Math.random() * spawnPoints.length );

				} while ( takenSlot.indexOf(randPos) != -1 );

				takenSlot.push(randPos);

				points.push( spawnPoints[randPos] );

			}

			item.points = points;
			

		}

		if ( !stackDiff ) return data;

		while ( stackDiff-- ) {

			var item = data[items[ Math.floor( Math.random() * items.length ) ]];

			do {
				
				var randPos = Math.floor( Math.random() * spawnPoints.length );

			} while ( takenSlot.indexOf(randPos) != -1 );

			takenSlot.push(randPos);

			item.points.unshift( spawnPoints[randPos] );
			item.stack++;

		}
		
		// return data
		return data;

	} // end of getStack Count

	return {
		get : getCombination,
		stack : setStackCount
	}

}()); // end of get Item combination module

// indexOf prototype for browser doesnt support indexOf in arrays
if (!Array.prototype.indexOf) {

	Array.prototype.indexOf = function(needle) {

		var count = this.length;

		while ( count-- ) {

			if (this[count] === needle) {
				return count;
			}

		}

		return -1;

	}

} // end of indexOf