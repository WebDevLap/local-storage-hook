import { useLS } from "./lib/useLS.js";

const [getName, setName] = useLS("name", { a: 50});
const [getAge, setAge] = useLS("age", '123');

setName({a: 123})
console.log(getName());
console.log(getAge());

