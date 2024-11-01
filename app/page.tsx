import Pagination from "../components/pagination";
import Words from "../components/words";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 max-w-screen-lg mx-auto">
      <Words list={WORDS} />
      <Pagination curr={1} end={1200} />
    </main>
  );
}

const WORDS = [
  {
    label: "sinskiy",
    occurences: 99999,
    percentage: 100,
  },
  {
    label: "kilwinta",
    occurences: 99999,
    percentage: 100,
  },
  {
    label: "john",
    occurences: 99999,
    percentage: 100,
  },
  {
    label: "galt",
    occurences: 99999,
    percentage: 100,
  },
  {
    label: "atlas",
    occurences: 99999,
    percentage: 100,
  },
  {
    label: "shrugged",
    occurences: 54000,
    percentage: 12.0,
  },
  {
    label: "ayn",
    occurences: 12545,
    percentage: 5.12,
  },
  {
    label: "rand",
    occurences: 5444,
    percentage: 2.01,
  },
];
