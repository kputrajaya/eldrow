import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Header from '../components/header';
import Keyboard from '../components/keyboard';
import Word from '../components/word';
import { ATTEMPT_COUNT, SOLVER_FIRST_WORD, WORD_LENGTH } from '../utils/constants';
import { bench, solve } from '../utils/solver';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [counter, setCounter] = useState(0);
  const [result, setResult] = useState('');

  useEffect(() => {
    setMode(localStorage.getItem('mode') || Object.keys(SOLVER_FIRST_WORD)[0]);
    window.bench = bench;
  }, []);

  useEffect(() => {
    const newGuesses = Array.from(Array(ATTEMPT_COUNT), () => ['', '']);
    if (mode) {
      newGuesses[0][0] = solve(mode, newGuesses);
    }
    setGuesses(newGuesses);
    setCounter(0);
    setResult('');
  }, [mode]);

  const setModeSideEffect = (newMode) => {
    localStorage.setItem('mode', newMode);
    setMode(newMode);
  };
  const setResultSideEffect = (newResult) => {
    const newGuesses = [...guesses];
    newGuesses[counter][1] = newResult;
    setGuesses(newGuesses);
    setResult(newResult);
  };
  const onSubmit = () => {
    if (result.length !== WORD_LENGTH) return;
    if (Array.from(result).every((char) => char === 'G')) {
      alert(`Nice! Guessed in ${counter + 1} attempt${counter ? 's' : ''}.`);
      router.reload(window.location.pathname);
      return;
    }
    const newCounter = counter + 1;
    if (newCounter >= ATTEMPT_COUNT) {
      alert('Failed to guess correctly!');
      router.reload(window.location.pathname);
      return;
    }
    const nextGuess = solve(mode, guesses);
    if (!nextGuess) {
      alert('No possible options found!');
      router.reload(window.location.pathname);
      return;
    }

    const newGuesses = [...guesses];
    newGuesses[newCounter] = [nextGuess, ''];
    setGuesses(newGuesses);
    setCounter(newCounter);
    setResult('');
  };

  return (
    <>
      <Head>
        <title>Eldrow - Wordle/Katla Solver</title>
      </Head>
      <div className="max-w-screen-sm h-screen px-4 mx-auto flex flex-col select-none">
        <Header mode={mode} setMode={setModeSideEffect} />
        <div className="min-h-0 -mx-1 py-3 overflow-hidden grow flex justify-center items-center">
          <div className={`max-h-full aspect-[5/6] grow flex flex-col`}>
            {guesses.map(([guessedWord, guessResult], index) => (
              <Word word={guessedWord} result={guessResult} highlight={index === counter} key={guessedWord} />
            ))}
          </div>
        </div>
        <Keyboard result={result} setResult={setResultSideEffect} onSubmit={onSubmit} />
      </div>
    </>
  );
}
