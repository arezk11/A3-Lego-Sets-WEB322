/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ALi Mohamed Ali Ahmed Rezk Student ID: 105593222 Date: 29/09/2023
*
********************************************************************************/
const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function Initialize() {
  return new Promise((resolve, reject) => {
    //loop through each object in the setData array
    for (const setDataItem of setData) {
      //find the theme object in themeData using the theme_id
      const itemThem = themeData.find(theme => theme.id === setDataItem.theme_id);

      //if a matching theme was found
      if (itemThem)
       {
        //create a new object by spreading the properties from setDataItem
        //and adding the "theme" property with the theme name
        const themSet = 
        {
          ...setDataItem,
          theme: itemThem.name
        };
        sets.push(themSet);
      }
    }

    resolve();
  });
}

function getAllSets() {
  return new Promise((resolve, reject) =>
  {
    resolve(sets);
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    const specificSet = sets.find(set => set.set_num === setNum);

    if (specificSet) {
      resolve(specificSet);
    } else {
      reject("no sets found!");
    }
  });
}
//HINT: Consider using the .filter() Array method as well as 
//the .toUpperCase() / .toLowerCase() and .includes() String methods for your solution
function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => 
  {
    const searchLowerThem = theme.toLowerCase();

    //filter method to find sets that contain the searchThemeLower
    const matchedSets = sets.filter(set =>
      set.theme.toLowerCase().includes(searchLowerThem)
    );

    if (matchedSets.length > 0) {
      resolve(matchedSets);
    } else {
      reject("no sets found!");
    }
  });
}

//exporting the modules
module.exports = { Initialize, getAllSets, getSetByNum, getSetsByTheme };

//testing:  
// Initialize();
//   console.log("All Sets:");
// const allSets = getAllSets();
// console.log(allSets);

// console.log("Specific Set (set_num = '011-1'):");
// const specificSet = getSetByNum("001-1");
// console.log(specificSet);

// console.log("Sets Matching Theme (theme = 'Technic'):");
// const matchingSets = getSetsByTheme("Technic");
// console.log(matchingSets);