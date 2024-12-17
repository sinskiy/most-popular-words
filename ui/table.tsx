import { ReactNode } from "react";
import { cn } from "../lib/helpers";

const ROW_CLASSES = "w-full";
const BODY_HEAD_CLASSES = "py-4 mb-4";
const COLUMN_CLASSES = "px-2 md:px-4 !rounded-none";

interface TableProps {
  headerColumns: Array<string | undefined>;
  classes: string[];
  rows: {
    bodyRowClasses: string;
    header: string;
    columns: ReactNode[];
    key: string;
  }[];
}

export default function Table({ headerColumns, classes, rows }: TableProps) {
  return (
    <div className="overflow-x-scroll">
      <table className="max-w-none overflow-x-scroll border-separate border-spacing-x-0  border-spacing-y-2">
        <thead>
          <tr className={ROW_CLASSES}>
            {headerColumns.map((column, i) => (
              <th
                scope="col"
                key={i}
                className={cn([COLUMN_CLASSES, classes[i], "text-xs"])}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, header, columns, bodyRowClasses }) => (
            <tr key={key} className={cn([ROW_CLASSES])}>
              <th
                scope="row"
                className={cn([
                  COLUMN_CLASSES,
                  BODY_HEAD_CLASSES,
                  bodyRowClasses,
                  classes[0],
                ])}
              >
                {header}
              </th>
              {columns.map((column, i) => (
                <td
                  key={i}
                  className={cn([
                    COLUMN_CLASSES,
                    bodyRowClasses,
                    classes[i + 1],
                  ])}
                >
                  {column}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
