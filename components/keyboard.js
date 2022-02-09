import { WORD_LENGTH } from '../utils/constants';

export default function Keyboard({ result, setResult, onSubmit }) {
  const addLetter = (key) => {
    setResult((result + key).substring(0, WORD_LENGTH));
  };
  const deleteLetter = () => {
    setResult(result.substring(0, result.length - 1));
  };

  return (
    <div className="py-4 text-sm font-bold uppercase border-t border-slate-500 shrink-0 select-none">
      <div className="grid grid-flow-col gap-x-4">
        <div
          className="shrink-0 py-5 text-center bg-slate-500 hidden md:block rounded-lg cursor-pointer"
          onClick={() => onSubmit()}
        >
          Enter
        </div>
        <div
          className="col-span-2 py-5 text-center bg-emerald-700 rounded-lg cursor-pointer"
          onClick={() => addLetter('G')}
        >
          Green
        </div>
        <div
          className="col-span-2 py-5 text-center bg-yellow-700 rounded-lg cursor-pointer"
          onClick={() => addLetter('Y')}
        >
          Yellow
        </div>
        <div
          className="col-span-2 py-5 text-center bg-zinc-700 rounded-lg cursor-pointer"
          onClick={() => addLetter('B')}
        >
          Black
        </div>
        <div
          className="shrink-0 py-5 text-center bg-slate-500 hidden md:block rounded-lg cursor-pointer"
          onClick={() => deleteLetter()}
        >
          Delete
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 mt-4 md:hidden">
        <div className="shrink-0 py-5 text-center bg-slate-500 rounded-lg cursor-pointer" onClick={() => onSubmit()}>
          Enter
        </div>
        <div
          className="shrink-0 py-5 text-center bg-slate-500 rounded-lg cursor-pointer"
          onClick={() => deleteLetter()}
        >
          Delete
        </div>
      </div>
    </div>
  );
}
