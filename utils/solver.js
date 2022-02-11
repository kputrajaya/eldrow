import {
  ALPHABETS,
  ATTEMPT_COUNT,
  SOLVER_BASE_SCORE,
  SOLVER_EXPLORE_THRESHOLD,
  SOLVER_FIRST_WORD,
  SOLVER_VALID_WORDS,
  SOLVER_WORD_POOL,
  WORD_LENGTH,
} from '../utils/constants';

export const solve = (mode, guesses) => {
  if (!guesses[0][0]) return SOLVER_FIRST_WORD[mode];

  // Get valid words
  const wordPool = SOLVER_WORD_POOL[mode];
  const { validWords, unguessedChars } = filterWords(SOLVER_VALID_WORDS[mode] || wordPool, guesses);

  // Only 1 or 2 option(s) left
  if (validWords.length <= 2) {
    return validWords[0];
  }

  // Get guess using 2 approaches
  const isExploring = validWords.length > SOLVER_EXPLORE_THRESHOLD;
  return isExploring
    ? getGuessExploring(validWords, wordPool, unguessedChars)
    : getGuessNotExploring(validWords, unguessedChars);
};

export const bench = (mode) => {
  console.log('Processing...');

  // Process all valid words
  const wordPool = SOLVER_WORD_POOL[mode];
  const attemptData = (SOLVER_VALID_WORDS[mode] || wordPool).map((word) => {
    const guesses = Array.from(Array(ATTEMPT_COUNT)).map(() => ['', '']);
    for (let i = 0; i < ATTEMPT_COUNT; i++) {
      const guess = solve(mode, guesses);
      if (guess === word) return i + 1;

      const result = Array.from(guess)
        .map((char, index) => {
          if (char === word[index]) return 'G';
          return word.indexOf(char) >= 0 ? 'Y' : 'B';
        })
        .join('');
      guesses[i] = [guess, result];
    }
    return null;
  });

  // Print stats
  const successful = attemptData.filter((attempt) => attempt !== null);
  const successRate = (100 * successful.length) / attemptData.length;
  const attemptAvg = successful.reduce((acc, attempt) => acc + attempt) / successful.length;
  console.log(`Success rate: ${successRate.toFixed(2)}%`);
  console.log(`Avg. attempt: ${attemptAvg.toFixed(2)}`);
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

const getGuessExploring = (validWords, wordPool, unguessedChars) => {
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
  const topWords = wordPool
    .map((word) => [
      word,
      [...new Set(Array.from(word))].reduce((acc, char) => {
        const charPos = topUnguessedChars.indexOf(char);
        const score = charPos >= 0 ? SOLVER_BASE_SCORE - charPos : 0;
        return acc + score;
      }, 0),
    ])
    .sort(([, a], [, b]) => b - a);
  return topWords.length ? topWords[0][0] : null;
};

const getGuessNotExploring = (validWords, unguessedChars) => {
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
  const topWords = validWords
    .map((word) => [
      word,
      Array.from(word).reduce((acc, char, index) => {
        const score = unguessedCharCounter[char] ? unguessedCharCounter[char][index] : 0;
        return acc + score;
      }, 0),
    ])
    .sort(([, a], [, b]) => b - a);
  return topWords.length ? topWords[0][0] : null;
};
