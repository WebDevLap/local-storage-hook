import { useLS } from "./lib/useLS.js";

const [getName, setName] = useLS("name", { a: 50});

setName({a: 231})
console.log(getName());

