'use strict';

//https://www.bennadel.com/blog/3295-using-chalk-2-0-s-tagged-template-literals-for-nested-and-complex-styling.htm

const chalk = require( "chalk" );


const balanceChalkTags = (inputString) => {
  const chalkOpeningTagRegex = /{[^{]+\s+[^{}]?}{0,1}/g
  const tokens = inputString.match(chalkOpeningTagRegex)
  if (tokens.length > 0) {
    const endings = inputString.split('').filter((char) => {
      return char === '}'
    })
    const imbalance = tokens.length - endings.length
    const isImbalanced = imbalance >= 0
    return `${inputString}${isImbalanced ? '}'.repeat(imbalance) : ''}`
  } else {
    return inputString 
  }
}

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

  const cookedString = cookedResults.join( "" )
  const rawString = rawResults.join( "" )

  const chalkParts = [ balanceChalkTags(cookedString) ];
  chalkParts.raw = [ balanceChalkTags(rawString) ];

  return(chalk(chalkParts));
}

module.exports = color;
