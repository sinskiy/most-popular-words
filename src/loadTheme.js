function loadTheme() {
  const matchedTheme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  const savedTheme = localStorage.getItem("theme") ?? matchedTheme ?? "light";
  document.documentElement.dataset.theme = savedTheme;

  document.querySelector("#theme").checked = savedTheme === "dark";
}

loadTheme();
