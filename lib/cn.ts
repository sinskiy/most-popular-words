export default function cn(classes: unknown | unknown[]) {
  if (!Array.isArray(classes)) {
    if (classes && typeof classes === "string") {
      return classes;
    } else {
      return "";
    }
  }

  return classes.filter((cssClass) => typeof cssClass === "string").join(" ");
}
