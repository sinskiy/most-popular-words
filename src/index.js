import displayBooks from "./DOMBooks.js";
import "./loadTheme.js";

const nav = document.querySelector("header nav");
nav.addEventListener("change", () => {
  const checked = nav.querySelector("input:checked");
  switch (checked.id) {
    case "by-book":
      displayBooks();
      break;

    default:
      displayHome();
  }
});

import "./reset.css";
import "./style.css";

import "./toggleTheme.js";

export const main = document.querySelector("main");

function displayHome() {}
