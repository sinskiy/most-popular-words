import displayBooks from "./DOMBooks.js";
import displayPage from "./DOMPage.js";
import "./loadTheme.js";
import "./reset.css";
import "./style.css";
import "./toggleTheme.js";

const nav = document.querySelector("header nav");
nav.addEventListener("change", displaySelected);

function displaySelected() {
  const checked = nav.querySelector("input:checked");
  switch (checked.id) {
    case "by-book":
      displayBooks();
      break;

    default:
      displayPage();
  }
}

displaySelected();
