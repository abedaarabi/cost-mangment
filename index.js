/*
---Wall---
"Type Name": "400.000 mm"
 "Width": "400.000 mm",



*/

const xlsx = require("xlsx");

const data = require("./data1.json");

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

const resultData = hasIdentityData(data.data.collection).filter((item) => {
  return (
    item.name.includes("Basic Wall") ||
    item.name.includes("Floor") ||
    item.name.includes("Basic Roof")
  );
});

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
  "Beton bagvægs sternelement  - 240mm": 5500,
  "Huldæk - 180mm": 5500,
};
const hours = {
  //Price for each wall type
  "Sandwichelement - 480mm": 2,
  "Sandwichelement - 450mm": 1.7,
  "Beton vægelement - 150mm": 3,
  "Fundament - 900mm": 3.21,
  "Beton bagvægs sternelement  - 240mm": 3,
  "Huldæk - 180mm": 0.5,
};

function getTotal(data) {
  const obj1 = resultData.reduce((acc, elment) => {
    const wallName = elment.name;
    const wWallName = wallName.split("[")[0];
    acc[wWallName] = {};
    return acc;
  }, {});

  for (let wall of data) {
    const wallIdentityData =
      wall.properties["Identity Data"]["Type Name"].split("-")[1];

    const wallArea = wall.properties["Dimensions"]["Area"];

    const foundation = wall.properties["Dimensions"]["Volume"];

    const wallTypes = wall.properties["Identity Data"]["Type Name"];

    const totalArea = Number(wallArea.split("m^2")[0]);
    const wallName = wall.name;
    const wWallName = wallName.split("[")[0];

    if (!obj1[wWallName][wallTypes]) {
      obj1[wWallName][wallTypes] = {
        type: wallTypes,
        totalArea: 0,
        sum: 0,
        totalPrice: 0,
        totalWidth: 0,
      };
    }

    if (wallTypes === "Fundament - 900mm") {
      obj1[wWallName][wallTypes].totalWidth += Number(
        foundation.split("m^3")[0]
      );
      obj1[wWallName][wallTypes].totalPrice +=
        Number(totalArea) * +wallPrices[wallTypes];
      obj1[wWallName][wallTypes].sum++;
      delete obj1[wWallName][wallTypes].totalArea;
    } else {
      delete obj1[wWallName][wallTypes].totalWidth;
      obj1[wWallName][wallTypes].totalArea += Number(totalArea);
      obj1[wWallName][wallTypes].totalPrice +=
        Number(totalArea) * +wallPrices[wallTypes];
      obj1[wWallName][wallTypes].sum++;
    }
  }

  // await writeXls("test.xlsx", obj1);

  return obj1;
}

const result1 = getTotal(resultData);

const groupBy = Object.keys(result1);
const dataObj = Object.values(result1);
const schema = dataObj.map((i) => Object.keys(i)).flat();
const values = dataObj.map((i) => Object.values(i)).flat();
const element = Object.entries(dataObj).flat();

console.log(dataObj);

const bb = schema.map((g, idx) => {
  return { type: g, ...values[idx] };
});

const yy = dataObj.map((d, idx) => {
  const val = Object.values(d);

  return val;
});

// const yy = dataObj.reduce((acc, val, idx) => {
//   const obj = {};

//   acc.push(val);
//   return acc;
// }, []);

const newWB = xlsx.utils.book_new();
groupBy.forEach((val, idx) => {
  const newWS = xlsx.utils.json_to_sheet(yy[idx]);

  xlsx.utils.book_append_sheet(newWB, newWS, val);
  xlsx.writeFile(newWB, "metadata_cost.xlsx");
});

// const newWB = xlsx.utils.book_new();

// const newWs = xlsx.utils.json_to_sheet(bb);

// xlsx.utils.book_append_sheet(newWB, newWs, "cost");
// xlsx.writeFile(newWB, "metadata_cost.xlsx");
