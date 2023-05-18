"use strict";

/** This object sets up the word search game, as well as button functions (for solving
 * and for refreshing/setting up a new game).
 *
 * @author Noor Aftab
 *	
 * @param {String} gameId ID of the word search game div (where the actual grid of letters goes)
 * @param {String} listId ID of the div where the list of words to find goes
 * @param {String} solveId ID for button to solve the puzzle
 * @param {String} newGameId ID for button to start a new game
 * @param {String} newGameId2 ID for button to start a new game
 * @param {String} instructionsId ID for the h2 heading (to allow us to update it's text with ease)
 * @param {String} themeId ID for part of the h3 heading (to show the theme of the word search)
 */

function WordSearchController(gameId, listId, solveId, newGameId,newGameId2, instructionsId, themeId) {

	//an object containing various themes/words for the game
	var searchTypes = {

		"Math! (please don't run away)": [["protecao", "dados", "privacidade", "seguranca"],
			["ciberseguranca", "conformidade", "lgpd", "riscos"],
			["vulnerabilidade", "vazamento", "violacao", "titulares"],
			["anpd", "controlador", "consentimento", "finalidade"],
			["anonimizacao",  "pessoais",  "tratamento", "prevencao"]],

		"Astronomy and Physics!": [["ciberseguranca", "conformidade", "lgpd", "riscos"],
		  	["protecao", "dados", "privacidade", "seguranca"],
		  	["anonimizacao", "pessoais", "tratamento", "prevencao"],
		  	["vulnerabilidade", "vazamento", "violacao", "titulares"],
		  	["anpd", "controlador", "consentimento", "finalidade"]],

		"Philosophy!": [["anpd", "controlador", "consentimento", "finalidade"],
		 	["protecao", "dados", "privacidade", "seguranca"],
		 	["ciberseguranca", "conformidade", "lgpd", "riscos"],
		 	["vulnerabilidade", "vazamento", "violacao", "titulares"],
		 	["anonimizacao", "pessoais", "tratamento", "prevencao"]],

	};

	//variables to store game logic and it's view
	var game;
	var view;

	//instructions to display in h2 header
	var mainInstructions = "Pesquise a lista de palavras dentro da caixa e clique e arraste para selecioná-las!";

	//function call to start the word search game
	setUpWordSearch();

	/** randomly chooses a word theme and sets up the game matrix and the game 
	 * view to reflect that theme
	 */

	function verificarModoComputador() {
		var isMobile = isMobileDevice();
		if (isMobile) {
		  var isModoComputador = window.innerWidth > 1024; // Defina o valor de largura desejado para identificar dispositivos móveis
		  if (isModoComputador) {
			alert("O modo 'para computador' está ativado desative para ter uma melhor experiência!");
		  }
		}
	  }
	  
	  // Verifica se o dispositivo é móvel
	  function isMobileDevice() {
		return /Mobi/i.test(navigator.userAgent);
	  }
	  
	  // Chama a função para verificar o modo na inicialização
	  verificarModoComputador();
	  
	  // Chama a função novamente quando a janela for redimensionada
	  window.addEventListener('resize', verificarModoComputador);
	  
	  function setUpWordSearch() {
		// gera um tema aleatório
		var searchTypesArray = Object.keys(searchTypes); // converte o objeto de temas em um array
		var randIndex = Math.floor(Math.random() * searchTypesArray.length); // gera um número/índice aleatório
		var listOfWords = searchTypes[searchTypesArray[randIndex]]; // recupera a matriz de palavras a partir do índice aleatório
	  
		// converte as letras para maiúsculas
		convertToUpperCase(listOfWords);
	  
		// define os cabeçalhos para refletir as instruções e temas
		updateHeadings(mainInstructions, searchTypesArray[randIndex]);
	  
		// executa a lógica do jogo usando uma cópia da lista de palavras (para evitar alterações no objeto real)
		game = new WordSearchLogic(gameId, listOfWords.slice());
		game.setUpGame();
	  
		// gera a visualização do jogo e configura os eventos do mouse para clique e arraste
		view = new WordSearchView(game.getMatrix(), game.getListOfWords(), gameId, listId, instructionsId);
		view.setUpView();
	  
		if (isMobileDevice()) {
		  var isModoComputador = window.innerWidth > 1024; // Defina o valor de largura desejado para identificar dispositivos móveis
		  if (isModoComputador) {
			alert("O modo 'para computador' está ativado desative para ter uma melhor experiência");
		  }
		  view.triggerTouchDrag();
		} else {
		  view.triggerMouseDrag();
		}
	  }
	  

	/** converts a given 2D array of words to all uppercase
	 *
	 * @param {String[][]} wordList a matrix of words to convert to uppercase
	 */
	function convertToUpperCase(wordList)  {

		for (var i = 0; i < wordList.length; i++) {

			for(var j = 0; j < wordList[i].length; j++) {

				wordList[i][j] = wordList[i][j].toUpperCase();

			}

		}

	}

	/** updates the instructions (h2) and theme (h3) headings according to the given
	 * text parameters
	 *
	 * @param {String} instructions text to set the h2 heading to
	 * @param {String} theme text to set the h3 theme element to
	 */
	function updateHeadings(instructions, theme) {

		$(instructionsId).text(instructions);
		$(themeId).text(theme);

	}

	/** solves the word search puzzle when the solve button is clicked
	 *
	 * @event WordSearchController#click
	 * @param {function} function to execute on mouse click
	 */
	$(solveId).click(function() {

		view.solve(game.getWordLocations(), game.getMatrix());

	});

	/** empties the game and list divs and replaces them with a new setup, modelling
	 * a 'refresh' effect when button is clicked
	 *
	 * @param {function} function to execute on mouse click to generate a new puzzle
	 */
	$(newGameId).click(function() {

		//empties the game and list elements, as well as the h3 theme span element
		$(gameId).empty();
		$(listId).empty();
		$(themeId).empty();

		//calls the set up to create a new word search game
		setUpWordSearch();

	})
	$(newGameId2).click(function() {

		//empties the game and list elements, as well as the h3 theme span element
		$(gameId).empty();
		$(listId).empty();
		$(themeId).empty();

		//calls the set up to create a new word search game
		setUpWordSearch();

	})

}