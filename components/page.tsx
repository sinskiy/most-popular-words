import { PAGE_CLASSES } from "./pagination";

interface PageProps {
  page: string | number;
  curr: number;
}

export default function Page({ page, curr }: PageProps) {
  return (
    <div
      className={`${PAGE_CLASSES} relative ${
        page === curr ? "primary" : "neutral"
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
