declare global {
  interface WindowEventHandlersEventMap {
    "pokemon/set": CustomEvent<{ id: number; eventId: string }>;
    "pokemon/get": CustomEvent<{ eventId: string }>;
  }
}

export {};
