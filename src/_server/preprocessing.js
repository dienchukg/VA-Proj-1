/**
 * Helper function to preprocess the data
 */

/**
 * # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
 *
 * !!!!! Here an below, you can/should edit the code  !!!!!
 * - you can modify the data preprocessing functions
 * - you can add other data preprocessing functions for other functionalities
 *
 * # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
 */
/**
 * Returns boolean value, whether given row meets parameter conditions
 * @param {*} parameters
 * @param {*} row
 * @returns boolean
 */
export function is_below_max_weight(parameters, row) {
  return row.weight < parameters.max_weight
}
/**
 * Calculates the bmi for a specific person
 * @param {age, height, name, weight} person
 * @returns {age, bmi, height, name, weight}
 */
export function calc_bmi(person) {
  person.bmi = person.weight / ((person.height / 100) * (person.height / 100))
  return person
}
/**
 * Converts all attribute values to float, than can be converted
 * @param {*} obj
 * @returns {*}
 */
export function parse_numbers(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!isNaN(obj[key])) {
        obj[key] = parseFloat(obj[key])
      }
    }
  }
  return obj
}
/**
 * Test add function to demonstrate testing with jest in file preprocessing.test.js
 *
 * Adds the input numbers
 * @param {number} a 
 * @param {number} b
 * @returns number
 */
export function test_func_add(a, b) {
  return a + b
}


/**
 * Filters out the top X ranked games from the provided array of games.
 * @param {Array} games - The array of game objects.
 * @param {number} x - The number of top ranked games to filter.
 * @returns {Array} - An array containing the top X ranked games.
 */
export function filterTopRankedGames(games, x) {
  // Sort the games based on their ranks in ascending order
  const sortedGames = games.sort((a, b) => a.rank - b.rank);
  
  // Return the top X ranked games
  return sortedGames.slice(0, x);
}

/**
 * Selects games within a certain category from the provided array of games.
 * @param {Array} games - The array of game objects.
 * @param {string} category - The category to filter by.
 * @returns {Array} - An array containing games within the specified category.
 */
export function selectGamesByCategory(games, category) {
  if (category === 'all') {
    return games;
  } else {
   
    return games.filter(game => {
      
      return game.types.categories.some(cat => cat.name === category);
    });
  }
}


export function selectGamesByMechanic(games, mechanic) {
  if(mechanic === 'all') return games;
  else{
    return games.filter(game => {
    
      return game.types.mechanics.some(mech => mech.name === mechanic);
    });
  }
  
}

export function in_top_10_popular_categories(games) {
  const top_10_categories = [
    'Economy', 'Fantasy', 'Science Fiction', 'Adventure', 'Fighting',
    'Card Game', 'Exploration', 'Miniatures', 'Medieval', 'Industry/Manufacturing'
  ];

  games.forEach(game => {
    game.in_top_10_cat = game.types.categories.some(cat => top_10_categories.includes(cat.name));
  });
}

export function in_top_10_popular_mechanics(games){
  let top_10_mechanics = [
    'Hand Management',
    'Solo / Solitaire Game',
    'Variable Player Powers',
    'Variable Set-up',
    'Worker Placement',
    'Dice Rolling',
    'End Game Bonuses',
    'Open Drafting',
    'Set Collection',
    'Cooperative Game'
];
  games.forEach(game => {
    game.in_top_10_mech = game.types.mechanics.some(mech => top_10_mechanics.includes(mech.name));
  });
}
 





