import { type Word } from "../types/word";

export default function Word({
  rank,
  label,
  occurences,
  percentage,
}: Word & { rank: number }) {
  return (
    <li
      className={`w-full px-12 py-4 flex items-center ${
        rank === 1
          ? "primary"
          : rank === 2
          ? "secondary"
          : rank == 3
          ? "tertiary"
          : "neutral"
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
