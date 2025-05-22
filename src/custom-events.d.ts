declare global {
  interface WindowEventHandlersEventMap {
    "counter/set": CustomEvent<{ counter: number; eventId: string }>;
    "counter/get": CustomEvent<{ eventId: string }>;
  }
}

export {};
