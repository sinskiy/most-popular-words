import { PAGE_CLASSES } from "./pagination";

interface PageProps {
  page: string | number;
  curr: number;
}

export default function Page({ page, curr }: PageProps) {
  return (
    <div
      className={`${PAGE_CLASSES} relative ${
        page === curr
          ? "bg-yellow-950 border-yellow-500"
          : "bg-slate-950 border-slate-300"
      }`}
    >
      {page}
      <input
        type="radio"
        name="page"
        id={String(page)}
        className="absolute inset-0 opacity-0"
        defaultChecked={curr === page}
      />
    </div>
  );
}
