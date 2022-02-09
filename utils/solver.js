import {
  ALPHABETS,
  SOLVER_BASE_SCORE,
  SOLVER_EXPLORE_THRESHOLD,
  SOLVER_VALID_WORDS,
  SOLVER_WORD_POOL,
  WORD_LENGTH,
} from '../utils/constants';

export const solve = (mode, guesses) => {
  const wordPool = SOLVER_WORD_POOL[mode];
  const { validWords, unguessedChars } = filterWords(SOLVER_VALID_WORDS[mode] || wordPool, guesses);

  // Only 1 or 2 option(s) left
  if (validWords.length <= 2) {
    return validWords[0];
  }

  const isExploring = validWords.length > SOLVER_EXPLORE_THRESHOLD;
  let topWords;

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
      .slice(0, SOLVER_BASE_SCORE)
      .map(([char]) => char);
    topWords = wordPool.map((word) => [
      word,
      [...new Set(Array.from(word))].reduce((acc, char) => {
        const charPos = topUnguessedChars.indexOf(char);
        const score = charPos >= 0 ? SOLVER_BASE_SCORE - charPos : 0;
        return acc + score;
      }, 0),
    ]);
  }
  // From valid words, top char position probability
  else {
    const unguessedCharCounter = Array.from(unguessedChars).reduce(
      (acc, char) => ({
        ...acc,
        [char]: Object.fromEntries(Array.from(Array(WORD_LENGTH)).map((_, index) => [index, 0])),
      }),
      {}
    );
    validWords.forEach((word) => {
      Array.from(word).forEach((char, index) => {
        if (char in unguessedCharCounter) {
          unguessedCharCounter[char][index]++;
        }
      });
    });
    topWords = validWords.map((word) => [
      word,
      Array.from(word).reduce((acc, char, index) => {
        const score = unguessedCharCounter[char] ? unguessedCharCounter[char][index] : 0;
        return acc + score;
      }, 0),
    ]);
  }
  if (!topWords.length) {
    return null;
  }
  return topWords.sort(([, a], [, b]) => b - a)[0][0];
};

const filterWords = (wordPool, guesses) => {
  const conds = [];
  const unguessedChars = new Set(ALPHABETS);
  const correctChars = new Set();
  guesses.forEach(([guessedWord, guessResult]) => {
    conds.push((word) => word !== guessedWord);
    Array.from(guessResult).forEach((resultChar, index) => {
      const currentChar = guessedWord[index];
      unguessedChars.delete(currentChar);
      if (resultChar === 'G') {
        conds.push((word) => word[index] === currentChar);
        correctChars.add(currentChar);
      } else if (resultChar === 'Y') {
        conds.push((word) => word[index] !== currentChar && word.indexOf(currentChar) >= 0);
        correctChars.add(currentChar);
      }
    });
    Array.from(guessResult).forEach((resultChar, index) => {
      const currentChar = guessedWord[index];
      if (resultChar === 'B' && !correctChars.has(currentChar)) {
        conds.push((word) => word.indexOf(currentChar) === -1);
      }
    });
  });
  const validWords = wordPool.filter((word) => conds.every((cond) => cond(word)));

  return { validWords, unguessedChars };
};
