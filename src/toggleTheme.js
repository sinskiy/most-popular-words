const theme = document.querySelector("#theme");
theme.addEventListener("change", toggleTheme);

function toggleTheme() {
  const nextTheme = theme.checked ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
}
