// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var counter = 0;
      for (var i = 0; i < this.attributes[rowIndex].length; i++) {
        var currentValue = this.attributes[rowIndex][i];
        if (currentValue === 1) {
          counter++;
        }
      }

      if (counter >= 2) {
        return true;
      }

      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //iterate over the matrix
      for (var i = 0; i < this.attributes.n; i++) {
        //if the current array has a conflict
        if(this.hasRowConflictAt(i) === true) {
          return true;
        }
      }

      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
    //create a variable to count the number of pieces in the column
      var counter = 0;
    //for each element (row) in the array (outer array)
      for (var i = 0; i < this.attributes.n; i++) {
        //if the current row at colIndex is 1
        if (this.attributes[i][colIndex] === 1) {
          //add 1 to the count variable
          counter++;
        }
      }

      if (counter >= 2) {
      //return true
        return true;
      }
    //return false
      return false;

    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //iterate over each column
      for (var i = 0; i < this.attributes.n; i++) {
      //call hasColConflictAt(currentArray[currentColIndex]
        if (this.hasColConflictAt(i) === true) {
          return true;
        }
      }

      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, startRow) {
      //create a counter variable
      var counter = 0;
      //create a startColumn variable that equals majorDiagonalColumnIndexAtFirstRow
      var startColumn = majorDiagonalColumnIndexAtFirstRow;

      //iterate over every row in the matrix
      for (var i = startRow || 0; i < this.attributes.n; i++){
        //if the current row at startColumn is 1
        if (this.attributes[i][startColumn] === 1) {
          //add 1 to counter
          counter++;
        }
        //add 1 to startColumn
        startColumn++;
      }

      //if counter >= 2
      if (counter >= 2) {
        //return true
        return true;
      }

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //iterate over each element in the first row
      for (var i = 0; i < this.attributes[0].length; i++) {
        //if hasMajorDiagonalConflictAt(currentElement) is true
        if (this.hasMajorDiagonalConflictAt(i)) {
          //return true
          return true;
        }
      }

      // iterate over the rest of the first column
      for (var j = 1; j < this.attributes.n; j++) {
        //if hasMajorDiagonalConflictAt(currentElement) is true
        if (this.hasMajorDiagonalConflictAt(0, j)) {
          //return true
          return true;
        }
      }

      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, startRow) {
      //create a counter variable
      var counter = 0;
      //create a startColumn variable that equals majorDiagonalColumnIndexAtFirstRow
      var startColumn = minorDiagonalColumnIndexAtFirstRow;
      //iterate over every row in the matrix starting at startColumn
      for (var i = startRow || 0; i < this.attributes.n; i++) {
        //if the current row at an index of startColumn is 1
        if (this.attributes[i][startColumn] === 1) {
          //add 1 to counter
          counter++;
        }

        //subtract 1 to startColumn
        startColumn--;
      }

      //if counter >= 2
      if (counter >= 2) {
        return true;
      }
        //return true
      //
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      //iterate over the first row of the matric
      for (var i = this.attributes.n - 1; i >= 0; i--) {
        //if hasMinorDiagonalConflictAt(currentIndex) === true
        if (this.hasMinorDiagonalConflictAt(i))
          //return true
          return true;
      }
      // iterate over last column
      for (var j = 1; j < this.attributes.n; j++) {
        //if hasMinorDiagonalConflictAt(currentIndex) === true
        if (this.hasMinorDiagonalConflictAt(this.attributes.n - 1, j)) {
          //return true
          return true;
        }
      }

      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
