export function getPages(curr: number, end: number) {
  const pages: number[] = [1];

  if (curr !== 1 && curr !== end) {
    pages.push(curr);
  }
  if (curr - 1 > 1 && curr - 1 !== end) {
    pages.push(curr - 1);
  }
  if (curr + 1 !== 1 && curr + 1 < end) {
    pages.push(curr + 1);
  }

  const prev = curr !== 1,
    next = curr < end;

  pages.sort((a, b) => a - b), pages.push(end);

  return { prev, pages, next };
}
