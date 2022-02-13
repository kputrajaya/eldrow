import {
  ALPHABETS,
  ATTEMPT_COUNT,
  SOLVER_EXPLORE_THRESHOLD,
  SOLVER_FIRST_WORD,
  SOLVER_VALID_WORDS,
  SOLVER_WORD_POOL,
  WORD_LENGTH,
} from '../utils/constants';

export const solve = (mode, guesses) => {
  if (!guesses[0][0]) return SOLVER_FIRST_WORD[mode];

  // Get valid words
  const { validWords, unguessedChars } = filterWords(SOLVER_VALID_WORDS[mode], guesses);
  if (!validWords.length) return null;
  if (validWords.length <= 2) return validWords[0];

  // Get guess using 2 approaches
  const isExploring = validWords.length > SOLVER_EXPLORE_THRESHOLD;
  return isExploring
    ? getGuessExploring(validWords, SOLVER_WORD_POOL[mode], unguessedChars)
    : getGuessNotExploring(validWords);
};

export const bench = () => {
  return Object.fromEntries(
    Object.keys(SOLVER_FIRST_WORD).map((mode) => {
      // Process all valid words
      const wordPool = SOLVER_WORD_POOL[mode];
      const attemptData = (SOLVER_VALID_WORDS[mode] || wordPool).map((word) => {
        const guesses = Array.from(Array(ATTEMPT_COUNT), () => ['', '']);
        for (let i = 0; i < ATTEMPT_COUNT; i++) {
          const guess = solve(mode, guesses);
          if (guess === word) return i + 1;

          const result = Array.from(guess, (char, index) => {
            if (char === word[index]) return 'G';
            return word.indexOf(char) >= 0 ? 'Y' : 'B';
          }).join('');
          guesses[i] = [guess, result];
        }
        return null;
      });

      // Provide stats
      const successful = attemptData.filter((attempt) => attempt !== null);
      const successRate = (100 * successful.length) / attemptData.length;
      const avgAttempt = successful.reduce((acc, attempt) => acc + attempt) / successful.length;
      return [
        mode,
        {
          successRate: successRate.toFixed(2),
          avgAttempt: avgAttempt.toFixed(2),
        },
      ];
    })
  );
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
  const unguessedCharCounter = Object.fromEntries(Array.from(unguessedChars, (char) => [char, 0]));
  validWords.forEach((word) => {
    Array.from(word).forEach((char) => {
      if (char in unguessedCharCounter) {
        unguessedCharCounter[char]++;
      }
    });
  });
  const topWords = wordPool
    .map((word) => [
      word,
      [...new Set(Array.from(word))].reduce((acc, char) => acc + (unguessedCharCounter[char] || 0), 0),
    ])
    .sort(([, a], [, b]) => b - a);
  return topWords[0][0];
};

const getGuessNotExploring = (validWords) => {
  const charCounter = {};
  validWords.forEach((word) => {
    Array.from(word).forEach((char, index) => {
      charCounter[char] = charCounter[char] || new Float32Array(WORD_LENGTH);
      charCounter[char][index]++;
    });
  });
  const topWords = validWords
    .map((word) => [
      word,
      Array.from(word).reduce((acc, char, index) => acc + (charCounter[char] ? charCounter[char][index] : 0), 0),
    ])
    .sort(([, a], [, b]) => b - a);
  return topWords[0][0];
};
