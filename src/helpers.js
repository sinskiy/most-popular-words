export function getAlphabeticString(originalString) {
  let newString = "";
  for (const char of originalString) {
    if (char.toLowerCase() !== char.toUpperCase() || char === " ") {
      newString += char;
    }
  }
  return newString;
}

export function lowerIncludes(string, find) {
  return string.toLowerCase().includes(find);
}
