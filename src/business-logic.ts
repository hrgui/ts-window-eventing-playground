const currentState: any = { id: 1, isLoading: true, data: null };

const MAX_POKEMON_ID = 1025;

export class Pokemon {
  data: any;
  constructor(data: any) {
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  get defaultBackImage() {
    return this.data.sprites.back_default;
  }

  get defaultFrontImage() {
    return this.data.sprites.front_default;
  }

  get allImages() {
    const res = Object.values(this.data.sprites).filter((v) => typeof v === "string");
    const other = Object.values(this.data.sprites.other)
      .map((x) => Object.values(x as any).filter((v) => typeof v === "string"))
      .flat();
    const versions = Object.values(this.data.sprites.versions)
      .map((x) =>
        Object.values(x as any)
          .map((y) => Object.values(y as any).filter((v) => typeof v === "string"))
          .flat()
      )
      .flat();

    return [...res, ...other, ...versions];
  }

  static async get(id: number) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return new Pokemon(await res.json());
  }

  static validate = (id: number) => {
    if (isNaN(id)) {
      return false;
    }

    if (id < 1) {
      return false;
    }

    if (id > MAX_POKEMON_ID) {
      return false;
    }

    return true;
  };
}

function setupEvents() {
  window.addEventListener("pokemon/set", (event) => {
    const isValid = Pokemon.validate(+event.detail.id);
    if (!isValid) {
      return;
    }

    currentState.id = event.detail.id;
    currentState.isLoading = true;
    window.dispatchEvent(
      new CustomEvent(`pokemon/set/${event.detail.eventId}/response`, {
        detail: { ...currentState },
      })
    );

    // inform general updater just for instant update
    window.dispatchEvent(
      new CustomEvent(`pokemon/set/response`, {
        detail: { ...currentState },
      })
    );

    Pokemon.get(currentState.id).then((data) => {
      currentState.isLoading = false;
      currentState.data = data;
      window.dispatchEvent(
        new CustomEvent(`pokemon/set/response`, {
          detail: { ...currentState, data },
        })
      );
    });
  });

  window.addEventListener("pokemon/get", ({ detail }) => {
    window.dispatchEvent(
      new CustomEvent(`pokemon/get/${detail.eventId}/response`, {
        detail: { ...currentState },
      })
    );
  });
}

setupEvents();
