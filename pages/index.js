import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Header from '../components/header';
import Keyboard from '../components/keyboard';
import Word from '../components/word';
import { FIRST_WORD } from '../utils/constants';
import { solve } from '../utils/solver';
import next from 'next';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState('katla');
  const [guesses, setGuesses] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setGuesses([
      [FIRST_WORD[mode], ''],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', ''],
      ['', ''],
    ]);
    setCounter(0);
  }, [mode]);

  const onKeyboardChange = (result) => {
    console.debug('kb change', result);
    const newGuesses = [...guesses];
    newGuesses[counter] = [guesses[counter][0], result];
    setGuesses(newGuesses);
  };
  const onKeyboardSubmit = () => {
    console.debug('kb submit');
    if (Array.from(guesses[counter][1]).every((char) => char === 'G')) {
      alert(`Congrats! Solved in ${counter + 1} attempt(s)`);
      return;
    }
    const nextGuess = solve(mode, guesses);
    if (!nextGuess) {
      alert('No possible option found!');
      router.reload(window.location.pathname);
    }

    const newCounter = counter + 1;
    const newGuesses = [...guesses];
    newGuesses[newCounter] = [nextGuess, ''];
    setGuesses(newGuesses);
    setCounter(newCounter);
  };

  return (
    <>
      <Head>
        <title>Eldrow - Wordle/Katla Solver</title>
      </Head>
      {mode ? (
        <div className="max-w-screen-md h-screen px-4 mx-auto flex flex-col">
          <Header />
          <div className="min-h-0 -mx-2 py-2 overflow-hidden grow flex flex-col">
            {guesses.map((guess, index) => (
              <Word word={guess[0]} colors={guess[1]} highlight={index === counter} key={index} />
            ))}
          </div>
          <Keyboard onChange={onKeyboardChange} onSubmit={onKeyboardSubmit} />
        </div>
      ) : (
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      )}
    </>
  );
}
