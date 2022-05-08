import { writable } from "svelte/store";

export function createActionsStore() {
  let {update, subscribe} = writable({
    undos: [],
    redos: [],
  });

  return {
    update,
    subscribe,
    add: (action) => update(state => {
      return {
        ...state,
        undos: [...state.undos, action],
        redos: [],
      }
    }),
    undo: () => update(state => {
      if (state.undos && state.undos.length > 0) {
        const [action] = [...state.undos].reverse();
        state.undos.pop();
        return {
          ...state,
          redos: [...state.redos, action],
          undos: [...state.undos],
          action
        };
      } else {
        return {
          ...state,
          action: null
        }
      }
    }),
    redo: () => update(state => {
      if (state.redos && state.redos.length > 0) {
        let [action] = [...state.redos].reverse();
        state.redos.pop();
        return {
          ...state,
          redos: [...state.redos],
          undos: [...state.undos, action],
          action
        };
      } else {
        return {
          ...state,
          action: null
        }
      }
    })
  }
}