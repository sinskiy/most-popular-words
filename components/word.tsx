import { type Word } from "../lib/word";

export default function Word({
  rank,
  label,
  occurences,
  percentage,
}: Word & { rank: number }) {
  return (
    <li
      className={`w-full px-12 py-4 flex items-center border-2 border-opacity-30 ${
        rank === 1
          ? "bg-yellow-950 border-yellow-500"
          : rank === 2
          ? "bg-stone-800 border-stone-100"
          : rank == 3
          ? "bg-orange-950 border-orange-500"
          : "bg-slate-950 border-slate-300"
      }`}
    >
      <p className="flex-1 flex gap-8 items-center">
        {rank}. <span className="text-4xl font-medium">{label}</span>
      </p>
      <div className="flex gap-8">
        <p className="flex gap-2">
          <span className="font-bold">{occurences}</span> occurences
        </p>
        <p>
          <span className="font-bold">{percentage}</span>%
        </p>
      </div>
    </li>
  );
}
