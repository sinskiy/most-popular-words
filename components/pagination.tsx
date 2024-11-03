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
  const pagesToRender = getPages(curr, end);
  return (
    <div className="flex gap-2 justify-center">
      <ManageCurrPage>&lt;&lt;</ManageCurrPage>
      {pagesToRender.map((page) => (
        <Page curr={curr} page={page} key={page} />
      ))}
      <ManageCurrPage>&gt;&gt;</ManageCurrPage>
    </div>
  );
}
