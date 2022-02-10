import { WORD_LENGTH } from '../utils/constants';

export default function Keyboard({ result, setResult, onSubmit }) {
  const addLetter = (key) => {
    setResult((result + key).substring(0, WORD_LENGTH));
  };
  const deleteLetter = () => {
    setResult(result.substring(0, result.length - 1));
  };

  return (
    <div className="pb-4 text-sm font-bold uppercase shrink-0">
      <div className="grid grid-flow-col gap-x-2">
        <div
          className="shrink-0 py-5 text-center bg-zinc-500 hidden md:block rounded cursor-pointer"
          onClick={() => onSubmit()}
        >
          Enter
        </div>
        <div
          className="col-span-2 py-5 text-center bg-emerald-700 rounded cursor-pointer"
          onClick={() => addLetter('G')}
        >
          Green
        </div>
        <div
          className="col-span-2 py-5 text-center bg-yellow-700 rounded cursor-pointer"
          onClick={() => addLetter('Y')}
        >
          Yellow
        </div>
        <div className="col-span-2 py-5 text-center bg-zinc-700 rounded cursor-pointer" onClick={() => addLetter('B')}>
          Black
        </div>
        <div
          className="shrink-0 py-5 text-center bg-zinc-500 hidden md:block rounded cursor-pointer"
          onClick={() => deleteLetter()}
        >
          Delete
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 mt-2 md:hidden">
        <div className="shrink-0 py-5 text-center bg-zinc-500 rounded cursor-pointer" onClick={() => onSubmit()}>
          Enter
        </div>
        <div className="shrink-0 py-5 text-center bg-zinc-500 rounded cursor-pointer" onClick={() => deleteLetter()}>
          Delete
        </div>
      </div>
    </div>
  );
}
