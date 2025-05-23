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
  asyncRequestEvent("pokemon/get").then(({ id, isLoading, data }: any) => {
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
