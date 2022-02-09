import { useMemo } from 'react';

import { WORD_LENGTH } from '../utils/constants';

export default function Word({ word, result, highlight }) {
  const blocks = useMemo(
    () =>
      Array.from(Array(WORD_LENGTH)).map((_, index) => ({
        char: word[index] || '',
        class:
          result[index] === 'G'
            ? 'bg-emerald-700 border-emerald-700'
            : result[index] === 'Y'
            ? 'bg-yellow-700 border-yellow-700'
            : result[index] === 'B'
            ? 'bg-slate-700 border-slate-700'
            : highlight
            ? 'border-slate-50'
            : 'border-slate-500',
      })),
    [word, result, highlight]
  );

  return (
    <div className={`my-2 flex-1 flex text-xl lg:text-2xl font-bold text-center uppercase`}>
      {blocks.map((block, index) => (
        <div className={`${block.class} mx-2 flex-1 flex justify-center items-center border-2`} key={index}>
          {block.char}
        </div>
      ))}
    </div>
  );
}
