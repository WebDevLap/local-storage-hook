type TypeLS = string | number | object | Array<TypeLS>;
type LSDataType = {
  typeof: "object" | "number" | "string" | "undefined";
  data: TypeLS;
};
type LSStringedDataType = {
  typeof: "object" | "number" | "string" | "undefined";
  data: string;
};

export function useLS<T extends TypeLS>(
  name: string,
  defValue: T
): [() => T, (val: T) => T] {
  let lsItem = localStorage.getItem(name);
  let state = getParsedData(lsItem);
  let modifiedState = createModifiedState(defValue, state) as T;
  state = setState(modifiedState);

  return [getState, setState];



  
  function createModifiedState(defState: any, state: any): TypeLS {
    if (typeof defState === "number" && typeof state === "number")
      return state as TypeLS;
    if (typeof defState === "string" && typeof state === "string")
      return state as TypeLS;
    if (typeof defState === "object" && typeof state === "object") {
      for (let key in defState) {
        if (!(key in state)) state[key] = defState[key];
        if (typeof state[key] !== typeof defState[key])
          state[key] = defState[key];
        if (typeof state[key] === "object")
          createModifiedState(defState[key], state[key]);
      }
      for (let key in state) {
        if (!(key in defState)) delete state[key];
      }
      return state as TypeLS;
    }
    return defState as TypeLS;
  }

  function getState() {
    return state as T;
  }

  function wrapperLSItem(data: TypeLS) {
    return JSON.stringify({
      typeof: typeof data,
      data: data,
    });
  }

  function setState(value: Partial<T>): T {
    if (typeof value === "object" && typeof state === "object") {
      const modifiedValue = createModifiedState(defValue, {
        ...state,
        ...value,
      });
      localStorage.setItem(name, wrapperLSItem(value));
      state = modifiedValue as T;
      return modifiedValue as T;
    }

    localStorage.setItem(name, wrapperLSItem(value));
    state = value as T;
    return value as T;
  }

  function parseLSItemWrapper(str: string | null): LSStringedDataType | null {
    if (!str) return null;
    const parsed: LSStringedDataType = JSON.parse(str);
    if (parsed.typeof === "string") return parsed;
    return {
      typeof: parsed.typeof,
      data: JSON.stringify(parsed.data),
    };
  }

  function getParsedData(lsItem: string | null): T | undefined {
    const lsWrapperParsed = parseLSItemWrapper(lsItem);

    switch (lsWrapperParsed?.typeof) {
      case "object": {
        return JSON.parse(lsWrapperParsed.data);
      }
      case "number": {
        return +lsWrapperParsed.data as T;
      }
      case "string": {
        return lsWrapperParsed.data as T;
      }
    }
    return undefined;
  }
}
