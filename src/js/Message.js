export default class Message {
  constructor() {
    this.root = root;
  }

  create() {}

  bindToDom() {
    const messageEl = document.createElement("div");
    messageEl.className = "message";

    this.root.prepand();
  }
}
