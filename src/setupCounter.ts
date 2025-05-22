const currentState = { count: 0 };

function setupEvents() {
  window.addEventListener("counter/set", (event) => {
    currentState.count = event.detail.counter;
    window.dispatchEvent(
      new CustomEvent(`counter/set/${event.detail.eventId}/response`, {
        detail: { counter: currentState.count },
      })
    );

    // inform general updater
    window.dispatchEvent(
      new CustomEvent(`counter/set/response`, {
        detail: { counter: currentState.count },
      })
    );
  });

  window.addEventListener("counter/get", ({ detail }) => {
    window.dispatchEvent(
      new CustomEvent(`counter/get/${detail.eventId}/response`, {
        detail: { counter: currentState.count },
      })
    );
  });
}

setupEvents();
