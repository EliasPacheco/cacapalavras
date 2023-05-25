"use strict";

/** This object contains the necessary functions to create the 'view' of the word search,
 * which essentially refers to displaying the puzzle and handling mouse events!
 *
 * @author Noor Aftab
 * 
 * @param {Array[]} matrix - 2D array containing the filled word search grid
 * @param {Array[]} list - 2D array containing the list of words in the grid
 * @param {String} gameId - div ID for the word search container
 * @param {String} listId - div ID for the container displaying list of words to find
 * @param {String} instructionsId - ID for the h2 heading, to update as necessary
 */

function WordSearchView(matrix, list, gameId, listId, instructionsId) {

	"use strict";

	var selfSolved = true;

	var names = {

		cell: "cell",
		pivot: "pivot",
		selectable: "selectable",
		selected: "selected",
		path: "path"

	};

	//object to hold oft-used class/id selectors 
	var select = {

		cells: "." + names.cell,
		pivot: "#" + names.pivot,
		selectable: "." + names.selectable,
		selected: "." + names.selected

	};

	var searchGrid = {

		row: "row",
		column: "column"

	};

	/* creates the word search puzzle grid and the table containing the list
	 * of words to find
	 */
	this.setUpView = function () {

		createSearchGrid(matrix, names.cell, searchGrid.row, searchGrid.column, gameId);
		createListOfWords(list, listId);

	}

	/** used strings because it was easy enough for a small program like this, wanted
	to explore jQuery's capabilities! **/

	/** used buttons because <td> would expand when adding border when found - stylistic purposes**/

	/** this funcion makes a 'table' of divs to store each letter in the matrix of letters
	 * created in wordsearchlogic.js
	 *
	 * @param {Array[]} matrix
	 * @param {String} cellName
	 * @param {String} rowAttr
	 * @param {String} colAttr
	 * @param {String} boardId
	 */
	function createSearchGrid(matrix, cellName, rowAttr, colAttr, boardId) {

		//loops through rows
		for (var i = 0; i < matrix.length; i++) {

			//creates a div for the table row and gives it a row class
			var row = $("<div/>");
			row.attr({ class: "boardRow" });  //only really used once, so it's not in a variable

			//loops through columns
			for (var j = 0; j < matrix[i].length; j++) {

				//each letter in the row is a button element
				var letter = $("<button/>");  //i hearbuttons are preferred for clickable actions

				//the letter is given a cell class, and given row and column attributes!
				letter.attr({
					class: cellName,
					[rowAttr]: i,
					[colAttr]: j
				}).text(matrix[i][j]); //sets text of button to the respective matrix index

				//adds letter to the larger row element
				letter.appendTo(row);

			}

			//adds the row of letters to the larger game board element
			row.appendTo($(boardId));
		}

	}

	/** This function creates a table-type object to insert all the words
	 * contained in the word search puzzle! players refer to this table
	 * when looking for words to find 
	 *
	 * @param {Array[]} wordList a matrix of words to insert into list container
	 * @param {String} wordListId the ID of the container! 
	 */
	function createListOfWords(wordList, wordListId) {

		//loops through rows
		for (var i = 0; i < wordList.length; i++) {

			//creates a div for the row
			var row = $("<div/>");
			row.attr({ class: "listRow" }); //gives the rows a list row class

			//loops through columns
			for (var j = 0; j < wordList[i].length; j++) {

				//each individual word is a list item element!
				var word = $("<li/>");

				//they're given a list word class, and an attribute containing it's trimmed text (as in the puzzle)
				word.attr({ class: "listWord", text: wordList[i][j].replace(/\W/g, "") });

				//given text from it's respected list index
				word.text(wordList[i][j]);

				//added to the larger list row element
				word.appendTo(row);

			}

			//row of words added to the larger word list div
			row.appendTo($(wordListId));

		}

	}

	/** this function solves the puzzle for the player!
	 *
	 * @param {Object} loc an object containing the locations of all the words to find in the puzzle!
	 * @param {Array[]} matrix the grid in which the words are placed in!
	 */
	this.solve = function (wordLoc, matrix) {

		/** converts the object into an array and loops through each index to find 
		 * the word with the coordinates/orientation properties, setting the words to found!
		 *
		 * @param {String} word - the (trimmed) word placed in the puzzle
		 */
		Object.keys(wordLoc).forEach(function (word) {

			var p = wordLoc[word].p;

			var startX = wordLoc[word].x;
			var startY = wordLoc[word].y;

			for (var k = 0, x = startX, y = startY; k < word.length; k++, x = incr[p](x, y).x, y = incr[p](x, y).y) {

				$(select.cells + "[row = " + x + "][column = " + y + "]").addClass("found");

			}

			selfSolved = false;

			validWordMade(list, word, instructionsId);

		});

	}
	this.triggerTouchDrag = function () {
		var selectedLetters = [];
		var wordMade = '';
		var wordCount = 0;

		$(select.cells).on("touchstart", function (event) {
			event.preventDefault();
			var touch = event.originalEvent.touches[0];
			var hoveredCell = $(this);
			var pathAttr = names.path;
			var path = hoveredCell.attr(names.path);

			selectedLetters = [];
			wordMade = '';

			$(this).addClass(names.selected);
			$(this).attr({ id: names.pivot });

			highlightValidDirections(hoveredCell, matrix, names.selectable);

			$(select.cells).on("touchmove", function (event) {
				event.preventDefault();
				var touch = event.originalEvent.touches[0];
				var currentCell = document.elementFromPoint(touch.clientX, touch.clientY);
				var currentDirection = $(currentCell).attr(names.path);

				if (currentCell && $(currentCell).hasClass(names.selectable)) {
					for (var i = 0; i < selectedLetters.length; i++) {
						selectedLetters[i].removeClass(names.selected);
					}

					selectedLetters = [];
					wordMade = '';

					var cells = selectCellRange(select.cells, $(currentCell), names.path, currentDirection, selectedLetters, wordMade);

					wordMade = cells.word;
					selectedLetters = cells.array;
				}
			});

			$(select.cells).on("touchend", function (event) {
				event.preventDefault();
				endMove();
			});

			$(gameId).on("touchcancel", function (event) {
				event.preventDefault();
				endMove();
			});
		});

		function endMove() {
			if (validWordMade(list, wordMade, instructionsId)) {
				$(select.selected).addClass("found");
				wordCount++;
				wordCountElement.innerHTML = wordCount;
			}

			$(select.selected).removeClass(names.selected);
			$(select.cells).removeAttr(names.path);
			$(select.pivot).removeAttr("id");
			$(select.selectable).removeClass(names.selectable);

			wordMade = '';
			selectedLetters = [];
		}
	};


	this.triggerMouseDrag = function () {

		var selectedLetters = [];
		var wordMade = '';
		var mouseIsDown = false;
		var wordCount = 0;

		$(select.cells).on("mousedown touchstart", function (event) {

			event.preventDefault(); // previne o comportamento padrão do toque

			// Verifica se há um toque
			if (event.type === "touchstart") {
				var touch = event.changedTouches[0];
				event.pageX = touch.pageX;
				event.pageY = touch.pageY;
			}

			mouseIsDown = true;

			$(this).addClass(names.selected);
			$(this).attr({ id: names.pivot });

			highlightValidDirections($(this), matrix, names.selectable);

		});

		$(select.cells).on("mousemove touchmove", function (event) {

			event.preventDefault(); // previne o comportamento padrão do toque

			// Verifica se há um toque
			if (event.type === "touchmove") {
				var touch = event.changedTouches[0];
				event.pageX = touch.pageX;
				event.pageY = touch.pageY;
			}

			if (mouseIsDown && $(this).hasClass(names.selectable)) {

				var currentDirection = $(this).attr(names.path);

				for (var i = 0; i < selectedLetters.length; i++) {

					selectedLetters[i].removeClass(names.selected);

				}

				selectedLetters = [];

				wordMade = '';

				var cells = selectCellRange(select.cells, $(this), names.path, currentDirection, selectedLetters, wordMade);

				wordMade = cells.word;
				selectedLetters = cells.array;

			}

		});

		$(select.cells).on("mouseup touchend", function (event) {

			event.preventDefault(); // previne o comportamento padrão do toque

			// Verifica se há um toque
			if (event.type === "touchend") {
				var touch = event.changedTouches[0];
				event.pageX = touch.pageX;
				event.pageY = touch.pageY;
			}

			endMove();

		});

		$(gameId).on("mouseleave touchcancel", function (event) {

			event.preventDefault(); // previne o comportamento padrão do toque

			// Verifica se há um toque
			if (event.type === "touchcancel") {
				var touch = event.changedTouches[0];
				event.pageX = touch.pageX;
				event.pageY = touch.pageY;
			}

			if (mouseIsDown) {

				endMove();

			}

		});

		function endMove() {

			mouseIsDown = false;

			if (validWordMade(list, wordMade, instructionsId)) {

				$(select.selected).addClass("found");
				wordCount++;
				wordCountElement.innerHTML = wordCount;
			}

			$(select.selected).removeClass(names.selected);
			$(select.cells).removeAttr(names.path);
			$(select.pivot).removeAttr("id");
			$(select.selectable).removeClass(names.selectable);

			wordMade = '';
			selectedLetters = [];


			wordCountElement.innerHTML = wordCount;

		}

	}



	function checkObjective() {

		let popup = document.getElementById("popup");
		let popup2 = document.getElementById("popup2");

		function openPopup() {
			popup.classList.add("open-popup");
		}
		function openiPopup() {
			popup2.classList.add("open-popup2");
		}
		var objetivoConcluido = true;

		if (objetivoConcluido) {
			clearInterval(countdownInterval);
			countdownDiv.innerHTML = "<span style='color: blue; font-family: Arial;'>Parabéns por concluir nosso caça palavras!" + "</span>";
			openPopup();
		}
		else {
			openiPopup();
		}
	}

	function highlightValidDirections(selectedCell, matrix, makeSelectable) {
		var cellRow = parseInt(selectedCell.attr(searchGrid.row));
		var cellCol = parseInt(selectedCell.attr(searchGrid.column));

		// Define as direções válidas com base nos caminhos disponíveis
		var validDirections = Object.values(paths);

		// Percorre as direções válidas
		validDirections.forEach(function (direction) {
			makeRangeSelectable(cellRow, cellCol, matrix.length, direction, makeSelectable);
		});
	}


	/** this functions makes a given path selectable but giving each cell in the path a 'selectable' class! 
	 * this makes it so that the player can only select cells on specific paths (which makes selecting vertically, 
	 * horizontally, and diagonally much less of a hassle!)
	 *
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {Number} l
	 * @param {String} p
	 * @param {String} selectable 
	 */
	function makeRangeSelectable(x, y, l, p, selectable) {
		for (var i = incr[p](x, y).x, j = incr[p](x, y).y;
			bounds[p](i, j, l);
			i = incr[p](i, j).x, j = incr[p](i, j).y) {

			$("[" + searchGrid.row + "= " + i + "][" + searchGrid.column + "= " + j + "]")
				.addClass(selectable)
				.attr({ [names.path]: p });
		}

	}

	/** this function finds and selects the range of cells from the pivot (first selected cell) to
	 * the cell the mouse is currenty hovering on, altogether going from end to end on the puzzle
	 * matrix
	 *
	 * @param {String} cellsSelector - selector name for cells in the search grid
	 * @param {Array} selectedCells
	 * @param {jQuery} hoveredCell - cell the mouse is hovering on
	 * @param {String} pathAttr - path/direction attribute 
	 * @param {String} path - value of the path attribute
	 * @param {String} wordConstructed - word user makes by dragging around on the puzzle
	 * @return returns an object containing: the word constructed and the array of selected DOM cells!
	 */
	function selectCellRange(cellsSelector, hoveredCell, pathAttr, path, selectedCells, wordConstructed) {
		var hoverIndex;
		var pivotIndex;
		var cellRange = cellsSelector + "[" + pathAttr + " =" + path + "]";

		switch (path) {
			case paths.vert:
			case paths.horizon:
			case paths.priDiag:
			case paths.secDiag:
				hoverIndex = hoveredCell.index(cellRange) + 1;
				pivotIndex = 0;
				wordConstructed = $(select.pivot).text();
				wordConstructed = selectLetters(selectedCells, wordConstructed, cellRange, pivotIndex, hoverIndex);
				break;

			case paths.vertBack:
			case paths.horizonBack:
			case paths.priDiagBack:
			case paths.secDiagBack:
				hoverIndex = hoveredCell.index(cellRange);
				pivotIndex = $(cellRange).length;
				wordConstructed += selectLetters(selectedCells, wordConstructed, cellRange, hoverIndex, pivotIndex);
				wordConstructed += $(select.pivot).text();
				break;
		}

		return { word: wordConstructed, array: selectedCells };
	}

	function selectLetters(selectedCells, wordConstructed, range, lowerIndex, upperIndex) {
		$(range).slice(lowerIndex, upperIndex).each(function () {
			$(this).addClass(names.selected);
			selectedCells.push($(this));
			wordConstructed += $(this).text();
		});

		return wordConstructed;
	}


	/** this function selects the range of cells between the pivot cell and the
	 * the cell the mouse is hovered, and adds their text to the constructed word's string
	 *
	 * @param {Array} selectedCells - array to hold 
	 * @param {String} wordConstructed - word being created by user
	 * @param {String} range - the path on which to select cells
	 * @param {Number} lowerIndex - index of the lower cell
	 * @param {Number} upperIndex - index of the higher cell
	 * @return returns the word made during the selection process!
	 */
	function selectLetters(selectedCells, wordConstructed, range, lowerIndex, upperIndex) {

		//only goes through the the range between the pivot and wherever the mouse is on the path!
		$(range).slice(lowerIndex, upperIndex).each(function () {

			//selects the cell
			$(this).addClass(names.selected);

			//adds it to the array of cells
			selectedCells.push($(this));

			//updates the word being made to include the newest cell's letter
			wordConstructed += $(this).text();

		});

		return wordConstructed;

	}

	/** checks if the word a user made after a move is an actual word to find, and 
	 * if so, sets the word as found! otherwise, nothing happens (so the move is 
	 * essentially ignored)
	 *
	 * @param {Array[]} wordList - matrix of words in the grid
	 * @param {String} wordToCheck - word to check for validity
	 * @param {String} instructionsId - selector for the h2 heading
	 * @return true if the word made is a word in the list
	 */
	function validWordMade(list, wordToCheck, instructionsId) {

		for (var i = 0; i < list.length; i++) {

			for (var j = 0; j < list[i].length; j++) {

				var trimmedWord = list[i][j].replace(/\W/g, "")

				if (wordToCheck == trimmedWord ||
					wordToCheck == reversedWord(trimmedWord)) {

					$(".listWord[text = " + trimmedWord + "]").addClass("found");

					checkPuzzleSolved(".listWord", ".listWord.found", instructionsId);

					return true;

				}

			}

		}

	}

	/** checks if all the words in the puzzle have been found, what method was used to 
	 * solve the puzzle, and updates the h2 instructions heading accordingly
	 *
	 * @param {String} fullList - selector for words in the wordlist div
	 * @param {String} foundWordsList - selector found words in the wordlist div
	 * @param {String} instructionsId - selector for h2 instructions heading
	 * @return true if the entire word search has been solved
	 */
	function checkPuzzleSolved(fullList, foundWordsList, instructionsId) {

		//if all the words in the list to find have been found (no. of words to find == no. of found words)
		if ($(fullList).length == $(foundWordsList).length) {

			//if user solved the puzzle themselves
			if (selfSolved) {


				checkObjective();

				//updates h2 text
				$(instructionsId).text("You got 'em all! :D");

			}

			//if user used the solve button 
			else {

				//updates h2 text
				$(instructionsId).text("We solved it for you! :~)");

			}

			return true;

		}

		return false;

	}

	/** reverses a string! (e.g. 'muscat' becomes 'tacsum')
	 *
	 * @param {String} word 
	 * @return 
	 */
	function reversedWord(word) {

		var reversedWord = "";

		for (var i = word.length - 1; i >= 0; i--) {

			reversedWord += word.charAt(i);

		}

		return reversedWord;

	}

}