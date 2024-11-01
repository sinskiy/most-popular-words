export function getPages(curr: number, end: number) {
  const pages: Array<number | string> = [1];

  if (curr !== 1 && curr !== end) {
    pages.push(curr);
  }
  if (curr - 1 > 1 && curr - 1 !== end) {
    pages.push(curr - 1);
  }
  if (curr + 1 !== 1 && curr + 1 < end) {
    pages.push(curr + 1);
  }

  pages.sort(), pages.push(end);

  return pages;
}
