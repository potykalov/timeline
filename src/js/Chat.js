import getTimestamp from "./utils/formatTimestamp.js";
import getGeolocation from "./utils/getGeolocation.js";
import parseCoordinates from "./utils/parseCoordinates.js";

export default class Chat {
  constructor(root) {
    this.root = root;
    this.messages = [];
    this.form;
    this.chatSpace;
    this.messageInput;
  }

  init() {
    this.bindToDom();
    this.initEventHandlers();
    this.renderChat();
  }

  bindToDom() {
    this.root.innerHTML = `
         <div class="chat-space">
      </div>

      <div class="chat-controller">
        <form class="chat-controller__form">
          <input
            class="chat-controller__message-input"
            type="text"
            name="message"
            placeholder="Введите сообщение"
          />
          <div class="chat-controller__buttons-wrapper">
            <button class="btn" type="button">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  d="M192 0C139 0 96 43 96 96l0 128c0 53 43 96 96 96s96-43 96-96l0-128c0-53-43-96-96-96zM48 184c0-13.3-10.7-24-24-24S0 170.7 0 184l0 40c0 97.9 73.3 178.7 168 190.5l0 49.5-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-49.5c94.7-11.8 168-92.6 168-190.5l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 79.5-64.5 144-144 144S48 303.5 48 224l0-40z"
                />
              </svg>
            </button>
            <button class="btn" type="button">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path
                  d="M96 64c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L96 64zM464 336l73.5 58.8c4.2 3.4 9.4 5.2 14.8 5.2 13.1 0 23.7-10.6 23.7-23.7l0-240.6c0-13.1-10.6-23.7-23.7-23.7-5.4 0-10.6 1.8-14.8 5.2L464 176 464 336z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
      <dialog class="location-dialog">
  <form class="location-dialog__form">
    <p>Что-то пошло не так</p>

    <p>
      К сожалению, нам не удалось определить ваше местоположение,
      пожалуйста дайте разрешение на использование геолокации,
      либо введите текст вручную.
    </p>

    <p>Широта и долгота через запятую</p>

    <input
      class="location-dialog__input"
      type="text"
      name="coordinates"
      placeholder="59.9343, 30.3351"
      required
    />

    <div class="location-dialog__buttons">
      <button type="button" class="location-dialog__cancel">Отмена</button>
      <button type="submit">ОК</button>
    </div>
  </form>
</dialog>`;

    this.chatSpace = this.root.querySelector(".chat-space");
    this.form = this.root.querySelector(".chat-controller__form");
    this.messageInput = this.root.querySelector(
      ".chat-controller__message-input",
    );
    this.locationDialog = this.root.querySelector(".location-dialog");
  }

  initEventHandlers() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let value = this.messageInput.value.trim();

      if (!value) {
        return;
      }

      const message = await this.createMessage(value);

      this.messages.push({ message });

      this.renderChat();

      this.messageInput.value = "";
    });
  }

  renderChat() {
    const lastMessage = this.messages.at(-1);

    if (lastMessage) {
      this.chatSpace.append(lastMessage.message);
    }

    this.chatSpace.scrollTop = this.chatSpace.scrollHeight;
  }

  async createMessage(value) {
    const timestamp = getTimestamp();

    let coordinates;

    try {
      coordinates = await getGeolocation();
    } catch (error) {
      console.error(error);
      coordinates = await this.requestManualCoordinates();
    }

    const message = document.createElement("div");
    message.className = "message";

    message.innerHTML = `
    <div class="message__content">
      <div class="message__main-content">
        <p class="message__text"></p>
        <div class="message__footer">
          <span class="message__coords"></span>
          <svg
            class="message__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
          >
            <path
              d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"
            />
          </svg>
        </div>
      </div>
      <time class="message__sended" datetime="">${timestamp}</time>
    </div>
  `;

    const messageText = message.querySelector(".message__text");
    messageText.textContent = value;

    const coords = message.querySelector(".message__coords");

    if (coordinates) {
      const { latitude, longitude } = coordinates;
      coords.textContent = `${latitude}, ${longitude}`;
    }

    return message;
  }

  requestManualCoordinates() {
    return new Promise((resolve) => {
      const dialog = this.locationDialog;
      const form = dialog.querySelector("form");
      const input = form.coordinates;
      const cancelButton = dialog.querySelector(".location-dialog__cancel");

      const cleanup = () => {
        form.removeEventListener("submit", onSubmit);
        cancelButton.removeEventListener("click", onCancel);
        dialog.removeEventListener("cancel", onCancel);
        input.removeEventListener("input", onInput);
      };

      const onSubmit = (e) => {
        e.preventDefault();

        try {
          const coordinates = parseCoordinates(input.value);

          resolve(coordinates);
          dialog.close();
          cleanup();
        } catch (error) {
          input.setCustomValidity(error.message);
          input.reportValidity();
        }
      };

      const onInput = () => {
        input.setCustomValidity("");
      };

      const onCancel = () => {
        resolve(null);
        dialog.close();
        cleanup();
      };

      form.addEventListener("submit", onSubmit);
      cancelButton.addEventListener("click", onCancel);
      dialog.addEventListener("cancel", onCancel);
      input.addEventListener("input", onInput);

      form.reset();
      dialog.showModal();
    });
  }
}
