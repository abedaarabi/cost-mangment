const obj = {
  a: 12,
  b: "b",
  c: 23,
  fanny: "coming late home",
};

const array = ["a", "b", "c", "t", "fanny"];

let newArray = [];
for (let index = 0; index < array.length; index++) {
    
  const element = array[index];

  const result = obj[element] || "not found";

  newArray.push({ [element]: result });
}

console.log("result will print in 3000s ");

setTimeout(() => {
  console.log(newArray);
}, 6000);
