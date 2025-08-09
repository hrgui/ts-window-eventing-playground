import "./style.css";

document.querySelector("#app")!.innerHTML = `
  <div>
  <div class="card">
    <button id="dec" type="button">-</button>
    <div id="id"></div>
    <button id="inc" type="button">+</button>
  </div>
  <h1 id="pokemonName">-</h1>
    <div id="pokemonImages"></div>
  </div>
`;

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type EventDetail<T extends keyof WindowEventMap> = WindowEventMap[T] extends CustomEvent<infer D>
  ? D
  : never;

function asyncRequestEvent<K extends keyof WindowEventMap & ("pokemon/get" | "pokemon/set")>(
  eventName: K,
  detail?: Omit<EventDetail<K>, "eventId">
): Promise<EventDetail<`${K}/response`>> {
  return new Promise((resolve, reject) => {
    const eventId = generateUUID();
    const responseEventName = `${eventName}/response` as `${K}/response`;

    const x = (event: Event) => {
      window.removeEventListener(responseEventName, x);
      const customEvent = event as CustomEvent<EventDetail<`${K}/response`>>;
      if (customEvent.detail && (customEvent.detail as any).error) {
        reject((customEvent.detail as any).error);
      } else {
        resolve(customEvent.detail);
      }
    };

    window.addEventListener(responseEventName, x);

    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          eventId,
          ...detail,
        } as EventDetail<K>,
      })
    );
  });
}

const inc = document.querySelector("#inc")!;
const dec = document.querySelector("#dec")!;

inc.addEventListener("click", async (e) => {
  const currentId = await asyncRequestEvent("pokemon/get");
  window.dispatchEvent(
    new CustomEvent("pokemon/set", {
      detail: { id: currentId.id + 1 },
    })
  );
});
dec.addEventListener("click", async (e) => {
  const currentId = await asyncRequestEvent("pokemon/get");
  window.dispatchEvent(
    new CustomEvent("pokemon/set", {
      detail: { id: currentId.id - 1 },
    })
  );
});

function onPokemonUpdated() {
  asyncRequestEvent("pokemon/get").then(({ id, isLoading, data }) => {
    document.getElementById("id")!.innerHTML = `#${id}`;

    document.getElementById("pokemonName")!.innerHTML =
      isLoading || !data ? `Loading...` : data.name;

    const pokemonImages = document.getElementById("pokemonImages");
    pokemonImages!.innerHTML = "";
    data?.allImages?.forEach((image: string) => {
      const img = document.createElement("img");
      img.src = image;
      img.width = 100;
      img.height = 100;
      img.alt = "Pokemon Image";
      img.className = "pokemon-image";
      pokemonImages?.appendChild(img);
    });
  });
}

window.addEventListener("pokemon/set/response", () => {
  onPokemonUpdated();
});

asyncRequestEvent("pokemon/set", { id: 1 }).then(() => {
  onPokemonUpdated();
});

(window as any).asyncRequestEvent = asyncRequestEvent;
//setupCounter(document.querySelector("#counter"));
