const main = document.querySelector("main");
export function displayNewSection(section) {
  main.innerHTML = "";
  main.appendChild(section);
}
