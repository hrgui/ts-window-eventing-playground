import "./style.css";
import javascriptLogo from "./javascript.svg";
import viteLogo from "/vite.svg";

document.querySelector("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`;

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function asyncRequestEvent(eventName: string, detail?: any): any {
  return new Promise((resolve, reject) => {
    const eventId = generateUUID();

    const x = (event: Event) => {
      removeEventListener(`${eventName}/${eventId}/response`, x);

      if ((event as CustomEvent).detail.error) {
        reject((event as CustomEvent).detail.error);
      } else {
        resolve((event as CustomEvent).detail);
      }
    };

    window.addEventListener(`${eventName}/${eventId}/response`, x);

    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          eventId,
          ...detail,
        },
      })
    );
  });
}

const element = document.querySelector("#counter")!;

element.addEventListener("click", async () => {
  const counterValueNow = await asyncRequestEvent("counter/get");
  const currentCount = counterValueNow.counter;
  window.dispatchEvent(
    new CustomEvent("counter/set", {
      detail: { counter: currentCount + 1 },
    })
  );
});

function onCounterUpdated() {
  asyncRequestEvent("counter/get").then(({ counter }: any) => {
    element.innerHTML = `count is ${counter}`;
  });
}

window.addEventListener("counter/set/response", () => {
  onCounterUpdated();
});

onCounterUpdated();

(window as any).asyncRequestEvent = asyncRequestEvent;
//setupCounter(document.querySelector("#counter"));
