import { useState } from 'react';

import { WORD_LENGTH } from '../utils/constants';

export default function Keyboard({ onChange, onSubmit }) {
  const [result, setResult] = useState('');

  const change = (key) => {
    const newResult = key === '-' ? result.substring(0, result.length - 1) : (result + key).substring(0, 5);
    setResult(newResult);
    onChange(newResult);
  };
  const submit = () => {
    if (result.length !== WORD_LENGTH) return;
    onSubmit(result);
    setResult('');
  };

  return (
    <div className="py-4 text-sm font-bold uppercase border-t border-slate-500 shrink-0 select-none">
      <div className="grid grid-flow-col gap-x-4">
        <div
          className="shrink-0 py-5 text-center bg-slate-500 hidden md:block rounded-lg cursor-pointer"
          onClick={() => submit()}
        >
          Enter
        </div>
        <div
          className="col-span-2 py-5 text-center bg-emerald-700 rounded-lg cursor-pointer"
          onClick={() => change('G')}
        >
          Green
        </div>
        <div
          className="col-span-2 py-5 text-center bg-yellow-700 rounded-lg cursor-pointer"
          onClick={() => change('Y')}
        >
          Yellow
        </div>
        <div className="col-span-2 py-5 text-center bg-zinc-700 rounded-lg cursor-pointer" onClick={() => change('B')}>
          Black
        </div>
        <div
          className="shrink-0 py-5 text-center bg-slate-500 hidden md:block rounded-lg cursor-pointer"
          onClick={() => change('-')}
        >
          Delete
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 mt-4 md:hidden">
        <div className="shrink-0 py-5 text-center bg-slate-500 rounded-lg cursor-pointer" onClick={() => submit()}>
          Enter
        </div>
        <div className="shrink-0 py-5 text-center bg-slate-500 rounded-lg cursor-pointer" onClick={() => change('-')}>
          Delete
        </div>
      </div>
    </div>
  );
}
