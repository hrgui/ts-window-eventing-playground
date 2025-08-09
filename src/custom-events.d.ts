declare global {
  interface WindowEventHandlersEventMap {
    "pokemon/set": CustomEvent<{ id: number; eventId: string }>;
    "pokemon/get": CustomEvent<{ eventId: string }>;
    "pokemon/set/response": CustomEvent<{
      id: number;
      isLoading: boolean;
      data: { name: string; allImages: string[] };
    }>;
    "pokemon/get/response": CustomEvent<{
      id: number;
      isLoading: boolean;
      data: { name: string; allImages: string[] };
    }>;
  }
  interface WindowEventMap extends WindowEventHandlersEventMap {}
}

export {};
