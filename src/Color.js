'use strict';

//https://www.bennadel.com/blog/3295-using-chalk-2-0-s-tagged-template-literals-for-nested-and-complex-styling.htm

const chalk = require( "chalk" );

const color = (parts, ...substitutions) => {
  const rawResults = [];
  const cookedResults = [];

  const partsLength = parts.length;
  const substitutionsLength = substitutions.length;

  for (let i = 0; i < partsLength; i++) {
    rawResults.push(parts.raw[i] );
    cookedResults.push(parts[i]);

    if (i < substitutionsLength) {
      rawResults.push(substitutions[i]);
      cookedResults.push(substitutions[i]);
    }

  }

  var chalkParts = [ cookedResults.join( "" ) ];
  chalkParts.raw = [ rawResults.join( "" ) ];

  return(chalk(chalkParts));
}

module.exports = color;
