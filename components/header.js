import { SOLVER_FIRST_WORD } from '../utils/constants';

export default function Header({ mode, setMode }) {
  return (
    <div className="grid grid-cols-2 text-xl md:text-2xl font-bold text-center uppercase border-b-2 border-zinc-500 shrink-0">
      {Object.keys(SOLVER_FIRST_WORD).map((modeChoice) => (
        <h1
          className={`pt-2 pb-3 ${mode !== modeChoice ? 'text-zinc-500 cursor-pointer' : ''}`}
          onClick={() => setMode(modeChoice)}
          key={modeChoice}
        >
          {modeChoice}
        </h1>
      ))}
    </div>
  );
}
