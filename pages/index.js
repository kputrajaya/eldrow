import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Header from '../components/header';
import Keyboard from '../components/keyboard';
import Word from '../components/word';
import { SOLVER_FIRST_WORD, WORD_LENGTH, ATTEMPT_COUNT } from '../utils/constants';
import { solve } from '../utils/solver';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState('wordle');
  const [guesses, setGuesses] = useState([]);
  const [counter, setCounter] = useState(0);
  const [result, setResult] = useState('');

  useEffect(() => {
    setMode(localStorage.getItem('mode') || 'wordle');
  }, []);

  useEffect(() => {
    const newGuesses = Array.from(Array(ATTEMPT_COUNT)).map(() => ['', '']);
    newGuesses[0][0] = SOLVER_FIRST_WORD[mode];
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
      alert(`Congrats! Solved in ${counter + 1} attempt${counter ? 's' : ''}.`);
      router.reload(window.location.pathname);
      return;
    }
    const nextGuess = solve(mode, guesses);
    if (!nextGuess) {
      alert('No possible options found!');
      router.reload(window.location.pathname);
      return;
    }

    const newCounter = counter + 1;
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
      <div className="max-w-screen-md h-screen px-4 mx-auto flex flex-col">
        <Header mode={mode} setMode={setModeSideEffect} />
        <div className="min-h-0 -mx-2 py-2 overflow-hidden grow flex flex-col">
          {guesses.map((guess, index) => (
            <Word word={guess[0]} colors={guess[1]} highlight={index === counter} key={index} />
          ))}
        </div>
        <Keyboard result={result} setResult={setResultSideEffect} onSubmit={onSubmit} />
      </div>
    </>
  );
}
