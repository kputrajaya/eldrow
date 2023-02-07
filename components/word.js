import { useMemo } from 'react';

import { WORD_LENGTH } from '../utils/constants';

export default function Word({ word, result, highlight }) {
  const blocks = useMemo(
    () =>
      Array.from(Array(WORD_LENGTH), (_, index) => {
        const block = {
          char: word[index] || '',
          class: highlight ? 'border-zinc-50' : 'border-zinc-500',
        };
        switch (result[index]) {
          case 'G':
            block.class = 'bg-emerald-700 border-emerald-700';
            break;
          case 'Y':
            block.class = 'bg-yellow-700 border-yellow-700';
            break;
          case 'B':
            block.class = 'bg-zinc-700 border-zinc-700';
            break;
        }
        return block;
      }),
    [word, result, highlight]
  );

  return (
    <div className={`my-1 flex-1 flex text-xl md:text-2xl font-bold text-center uppercase`}>
      {blocks.map((block) => (
        <div className={`${block.class} mx-1 flex-1 flex justify-center items-center border-2`} key={block.char}>
          {block.char}
        </div>
      ))}
    </div>
  );
}
