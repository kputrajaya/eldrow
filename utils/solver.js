import { ALPHABETS, BASE_SCORE, VALID_WORDS, WORD_POOL } from '../utils/constants';

export const solve = (mode, guesses) => {
  const wordPool = WORD_POOL[mode];
  let validWords = VALID_WORDS[mode] || wordPool;
  const unguessedChars = new Set(ALPHABETS);
  const correctChars = new Set();

  // Filter valid words
  const conds = [];
  guesses.forEach(([word, result]) => {
    Array.from(result).forEach((resultChar, index) => {
      const currentChar = word[index];
      unguessedChars.delete(currentChar);
      if (resultChar === 'G') {
        conds.push((word) => word[index] === currentChar);
        correctChars.add(currentChar);
      } else if (resultChar === 'Y') {
        conds.push((word) => word[index] !== currentChar && word.indexOf(currentChar) >= 0);
        correctChars.add(currentChar);
      }
    });
    Array.from(result).forEach((resultChar, index) => {
      const currentChar = word[index];
      if (resultChar === 'B' && !correctChars.has(currentChar)) {
        conds.push((word) => word.indexOf(currentChar) === -1);
      }
    });
  });
  validWords = validWords.filter((word) => conds.every((cond) => cond(word)));

  // Only 1 or 2 option(s)
  if (validWords.length <= 2) {
    return validWords[0];
  }

  const isExploring = validWords.length > 5;
  let topGuesses;

  // From word pool, top unguessed char occurrences
  if (isExploring) {
    const unguessedCharCounter = Array.from(unguessedChars).reduce((acc, char) => ({ ...acc, [char]: 0 }), {});
    validWords.forEach((word) => {
      Array.from(word).forEach((char) => {
        if (char in unguessedCharCounter) {
          unguessedCharCounter[char]++;
        }
      });
    });
    const topUnguessedChars = Object.entries(unguessedCharCounter)
      .sort(([, a], [, b]) => b - a)
      .slice(0, BASE_SCORE)
      .map(([char]) => char);
    topGuesses = wordPool
      .map((word) => [
        word,
        [...new Set(Array.from(word))].reduce((acc, char) => {
          const charPos = topUnguessedChars.indexOf(char);
          const score = charPos >= 0 ? BASE_SCORE - charPos : 0;
          return acc + score;
        }, 0),
      ])
      .sort(([, a], [, b]) => b - a);
  }
  // From valid words, top char position probability
  else {
    const unguessedCharCounter = Array.from(unguessedChars).reduce(
      (acc, char) => ({ ...acc, [char]: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 } }),
      {}
    );
    validWords.forEach((word) => {
      Array.from(word).forEach((char, index) => {
        if (char in unguessedCharCounter) {
          unguessedCharCounter[char][index]++;
        }
      });
    });
    topGuesses = validWords
      .map((word) => [
        word,
        Array.from(word).reduce((acc, char, index) => {
          const score = unguessedCharCounter[char] ? unguessedCharCounter[char][index] : 0;
          return acc + score;
        }, 0),
      ])
      .sort(([, a], [, b]) => b - a);
  }
  if (!topGuesses.length) {
    return null;
  }
  return topGuesses[0][0];
};
