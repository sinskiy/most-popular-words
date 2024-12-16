import { getPages } from "../lib/pages";
import { ManageCurrPage } from "./manage-curr-page";
import Page from "./page";

interface PaginationProps {
  curr: number;
  end: number;
}

export const PAGE_CLASSES =
  "size-10 flex items-center justify-center border-base";

export default function Pagination({ curr, end }: PaginationProps) {
  const { prev, pages, next } = getPages(curr, end);
  return (
    <div className="flex gap-2 justify-center mt-2">
      {prev && <ManageCurrPage page={curr - 1}>&lt;&lt;</ManageCurrPage>}
      {pages.map((page) => (
        <Page curr={curr} page={page} key={page} />
      ))}
      {next && <ManageCurrPage page={curr + 1}>&gt;&gt;</ManageCurrPage>}
    </div>
  );
}
