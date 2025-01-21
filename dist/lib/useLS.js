export function useLS(name, defValue) {
    let lsItem = localStorage.getItem(name);
    let state = getParsedData(lsItem);
    let modifiedState = createModifiedState(defValue, state);
    state = setState(modifiedState);
    return [getState, setState];
    function createModifiedState(defState, state) {
        if (typeof defState === "number" && typeof state === "number")
            return state;
        if (typeof defState === "string" && typeof state === "string")
            return state;
        if (typeof defState === "object" && typeof state === "object") {
            for (let key in defState) {
                if (!(key in state))
                    state[key] = defState[key];
                if (typeof state[key] !== typeof defState[key])
                    state[key] = defState[key];
                if (typeof state[key] === "object")
                    createModifiedState(defState[key], state[key]);
            }
            for (let key in state) {
                if (!(key in defState))
                    delete state[key];
            }
            return state;
        }
        return defState;
    }
    function getState() {
        return state;
    }
    function wrapperLSItem(data) {
        return JSON.stringify({
            typeof: typeof data,
            data: data,
        });
    }
    function setState(value) {
        if (typeof value === "object" && typeof state === "object") {
            const modifiedValue = createModifiedState(defValue, {
                ...state,
                ...value,
            });
            localStorage.setItem(name, wrapperLSItem(value));
            state = modifiedValue;
            return modifiedValue;
        }
        localStorage.setItem(name, wrapperLSItem(value));
        state = value;
        return value;
    }
    function parseLSItemWrapper(str) {
        if (!str)
            return null;
        return JSON.parse(str, (key, value) => {
            if (key === "data")
                return JSON.stringify(value);
            return value;
        });
    }
    function getParsedData(lsItem) {
        const lsWrapperParsed = parseLSItemWrapper(lsItem);
        switch (lsWrapperParsed?.typeof) {
            case "object": {
                return JSON.parse(lsWrapperParsed.data);
            }
            case "number": {
                return +lsWrapperParsed.data;
            }
            case "string": {
                return lsWrapperParsed.data;
            }
        }
        return undefined;
    }
}
