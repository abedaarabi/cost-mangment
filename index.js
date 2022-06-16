/*
---Wall---
"Type Name": "400.000 mm"
 "Width": "400.000 mm",



*/

const data = require("./data.json");

const hasIdentityData = (arr) => {
  const eltCollection = arr
    .filter((elt) => {
      if (
        elt.properties["Identity Data"] &&
        elt.properties["Identity Data"]["Type Name"]
      ) {
        return true;
      } else return false;
    })
    .filter((i) => i);

  return eltCollection;
};

const resultData = hasIdentityData(data.data.collection).filter((item) =>
  item.name.includes("Basic Wall")
);

const unitPriceBaton = 23;
const indx1 = 9.5;
const indx2 = 10.5;

let totalArea480mm = 0;
let totalArea1 = 0;

const wallPrices = {
  //Price for each wall type
  "Sandwichelement - 480mm": 4200,
  "Sandwichelement - 450mm": 4000,
  "Beton vægelement - 150mm": 1300,
  "Fundament - 900mm": 5500,
};

function getTotal(data) {
  let obj = {};



  for (let wall of data) {
    const wallIdentityData =
      wall.properties["Identity Data"]["Type Name"].split("-")[1];

    const wallArea = wall.properties["Dimensions"]["Area"];

    const foundation = wall.properties["Dimensions"]["Volume"];

    const wallTypes = wall.properties["Identity Data"]["Type Name"];

    const totalArea = Number(wallArea.split("m^2")[0]);
    if (!obj[wallTypes]) {
      obj[wallTypes] = {
        totalArea: 0,
        sum: 0,
        totalPrice: 0,
        totalWidth: 0,
      };
    }

    if (wallTypes === "Fundament - 900mm") {
      delete obj[wallTypes].totalArea;
      obj[wallTypes].totalWidth += Number(foundation.split("m^3")[0]);
      obj[wallTypes].totalPrice += Number(totalArea) * +wallPrices[wallTypes];
      obj[wallTypes].sum++;
    } else {
      delete obj[wallTypes].totalWidth;
      obj[wallTypes].totalArea += Number(totalArea);
      obj[wallTypes].totalPrice += Number(totalArea) * +wallPrices[wallTypes];
      obj[wallTypes].sum++;
    }
  }
  return obj;
}

const result1 = getTotal(resultData);

console.log(result1);

// const result = resultData.map((wall) => {
//   let obj = {};
//   const wallIdentityData =
//     wall.properties["Identity Data"]["Type Name"].split("-")[1];

//   const wallArea = wall.properties["Dimensions"]["Area"];

//   const wallTypes = wall.properties["Identity Data"]["Type Name"];

//   const totalArea = Number(wallArea.split("m^2")[0]);
//   if (!obj[wallTypes]) {
//     obj[wallTypes] = { totalArea: 0 };
//   }

//   obj[wallTypes].totalArea += totalArea;

//   return obj;
// });

// console.log(result);

// const resultIndx = (unitPriceBaton / indx1) * indx2;
// const resultPrice = totalArea480mm * resultIndx;

// console.log("Result Price: ", resultPrice);

// const walls = [
//   {
//     typeName: "Sandwichelement - 480mm",
//     area: 28.165,
//   },
//   {
//     typeName: "Sandwichelement - 480mm",
//     area: 22.165,
//   },
//   {
//     typeName: "Beton vægelement - 150mm",
//     area: 89.15,
//   },
//   {
//     typeName: "Beton vægelement - 150mm",
//     area: 165,
//   },
//   {
//     typeName: "Fundament - 900mm",
//     area: 45.2,
//   },
//   {
//     typeName: "Fundament - 900mm",
//     area: 16.5,
//   },
// ];

// const result = walls.reduce((acc, val) => {
//   if (!acc[val.typeName]) {
//     acc[val.typeName] = { totalArea: 0 };
//   }

//   acc[val.typeName]["totalArea"] += val.area;

//   //I need the sum of Each wall type?!
//   return acc;
// }, {});

// console.log(result);
