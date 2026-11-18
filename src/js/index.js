import Chat from "./Chat.js";

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.querySelector(".container");
  const chat = new Chat(rootEl);

  chat.init();
});
