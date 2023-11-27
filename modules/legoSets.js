/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ALi Mohamed Ali Ahmed Rezk Student ID: 105593222 Date: 29/09/2023
*
********************************************************************************/
// const setData = require("../data/setData");
// const themeData = require("../data/themeData");
//require('dotenv').config();
const env = require("dotenv")
env.config()
const Sequelize = require('sequelize');
require('dotenv').config();
// let sets = [];

let sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false },
  },
});
const Theme = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
});

const Set = sequelize.define('Set', {
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  num_parts: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER,
  img_url: Sequelize.STRING
});



Set.belongsTo(Theme, { foreignKey: "theme_id" });


// function Initialize() {
//   return new Promise((resolve, reject) => {
//     //loop through each object in the setData array
//     for (const setDataItem of setData) {
//       //find the theme object in themeData using the theme_id
//       const itemThem = themeData.find(theme => theme.id === setDataItem.theme_id);

//       //if a matching theme was found
//       if (itemThem)
//        {
//         //create a new object by spreading the properties from setDataItem
//         //and adding the "theme" property with the theme name
//         const themSet = 
//         {
//           ...setDataItem,
//           theme: itemThem.name
//         };
//         sets.push(themSet);
//       }
//     }

//     resolve();
//   });
// }

function Initialize() {
  // Sync all models with the database
  return sequelize.sync()
  .then(() => {
    // Successfully synchronized with the database
    console.log('Database synced successfully');
    // Resolve the promise here if needed
  })
  .catch((error) => {
    // Failed to synchronize with the database
    console.error('Error syncing database:', error);
    // Reject the promise if needed
  });
}

// function getAllSets() {
//   return new Promise((resolve, reject) =>
//   {
//     resolve(sets);
//   });
// }
function getAllSets() {
  return Set.findAll({
    include: [Theme]
  });
}

// function getSetByNum(setNum) {
//   return new Promise((resolve, reject) => {
//     const specificSet = sets.find(set => set.set_num === setNum);

//     if (specificSet) {
//       resolve(specificSet);
//     } else {
//       reject("no sets found!");
//     }
//   });
// }

function getSetByNum(setNum) {
  // Retrieve a single set by its set number
  return Set.findAll({
    where: { set_num: setNum },
    include: [Theme]
  }).then((set) => {
    if (!set) {
      throw new Error('Unable to find requested set');
    }
    return set;
  });
}

//HINT: Consider using the .filter() Array method as well as 
//the .toUpperCase() / .toLowerCase() and .includes() String methods for your solution
// function getSetsByTheme(theme) {
//   return new Promise((resolve, reject) => 
//   {
//     const searchLowerThem = theme.toLowerCase();

//     //filter method to find sets that contain the searchThemeLower
//     const matchedSets = sets.filter(set =>
//       set.theme.toLowerCase().includes(searchLowerThem)
//     );

//     if (matchedSets.length > 0) {
//       resolve(matchedSets);
//     } else {
//       reject("no sets found!");
//     }
//   });
// }
function getSetsByTheme(theme) {
  // Retrieve all sets with a specific theme
  return Set.findAll({
    include: [Theme],
    where: {
      '$Theme.name$': {
        [Sequelize.Op.iLike]: `%${theme}%`,
      },
    },
  }).then((sets) => {
    if (!sets || sets.length === 0) {
      throw new Error('Unable to find requested sets');
    }
    return sets;
  });
}

function addSet(setData) {
  return Set.create(setData);
}

function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.findAll()
      .then(themes => {
        resolve(themes);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function editSet(set_num, setData) {
  return new Promise(async (resolve, reject) => {
    try {
      const existingSet = await Set.findOne({
        where: { set_num },
      });

      if (!existingSet) {
        reject(new Error('Set not found'));
        return;
      }

      await existingSet.update(setData);

      resolve();
    } catch (error) {
      reject(new Error(error.errors[0].message));
    }
  });
}

function deleteSet(set_num) {
  return new Promise((resolve, reject) => {
    Set.destroy({
      where: {
        set_num: set_num,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.message);
      });
  });
}




//exporting the modules
module.exports = { Initialize, getAllSets, getSetByNum, getSetsByTheme,getSetsByTheme,
  addSet,
  getAllThemes,
  editSet,
  deleteSet, };

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
// sequelize
//   .sync()
//   .then( async () => {
//     try{
//       await Theme.bulkCreate(themeData);
//       await Set.bulkCreate(setData); 
//       console.log("-----");
//       console.log("data inserted successfully");
//     }catch(err){
//       console.log("-----");
//       console.log(err.message);

//       // NOTE: If you receive the error:

//       // insert or update on table "Sets" violates foreign key constraint "Sets_theme_id_fkey"

//       // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".   

//       // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
//     }

//     process.exit();
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
//   });