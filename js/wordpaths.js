"use strict";

/** as diferentes direções/orientações que uma palavra pode fluir na grade de palavras!
 *
 * nota: vertical - esquerda -> direita
 * horizontal - superior > inferior
 * diagonal primária - canto superior esquerdo -> canto inferior direito
 * diagonal secundária - canto superior direito -> canto inferior esquerdo
 *
 * 'para trás' no final da string refere-se a ir na direção oposta (então
 * inferior -> superior ou inferior esquerdo -> superior direito)
 */
var paths = { 

	vert: "vertical",
	horizon: "horizontal",
	priDiag: "primaryDiagonal",
	secDiag: "secondaryDiagonal",

	vertBack: "verticalBackwards",
	horizonBack: "horizonBackwards",
	priDiagBack: "primaryDiagonalBackwards",
	secDiagBack: "secondaryDiagonalBackwards",

};

/** this object sets up the matrix bounds for each orientation (just to ensure when inserting
 * a word into the board in a given path, the word doesnt exceed the size of the matrix)
 *
 * @param {Number} x row of current matrix index
 * @param {Number} y column of current matrix index
 * @param {Number} s size (width or height, either one as they should be equal) of the matrix of letters
 */
var bounds = { 

	[paths.vert]: (x, y, s) => (x < s),
	[paths.horizon]: (x, y, s) => (y < s),
	[paths.priDiag]: (x, y, s) => (x < s) && (y < s),
	[paths.secDiag]: (x, y, s) =>  (x < s) && (y >= 0),

	[paths.vertBack]: (x, y, s) => (x >= 0),
	[paths.horizonBack]: (x, y, s) => (y >= 0),
	[paths.priDiagBack]: (x, y, s) => (x >= 0) && (y >= 0),
	[paths.secDiagBack]: (x, y, s) => (x >= 0) && (y < s)

};

/** this object takes the given matrix row/colum and increments it in the 
 * direction of the path given
 *
 * @param {Number} x matrix row to increment
 * @param {Number} y matrix column to increment
 * @return incremented x and y coordinates (by a factor of 1)
 */
var incr = { 

	[paths.vert]: (x, y) => ({x: x+1, y: y}),
	[paths.horizon]: (x, y) => ({x: x, y: y+1}),
	[paths.priDiag]: (x, y) => ({x: x+1, y: y+1}),
	[paths.secDiag]: (x, y) => ({x: x+1, y: y-1}),

	[paths.vertBack]: (x, y) => ({x: x-1, y: y}),
	[paths.horizonBack]: (x, y) => ({x: x, y: y-1}),
	[paths.priDiagBack]: (x, y) => ({x: x-1, y: y-1}),
	[paths.secDiagBack]: (x, y) => ({x: x-1, y: y+1})

};