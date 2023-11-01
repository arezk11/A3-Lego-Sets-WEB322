/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name:Ali Rezk   Student ID: 105593222   Date:29/10/2023
*
*  Published URL: https://defiant-blue-shawl.cyclic.app/
*
********************************************************************************/

const express = require("express")
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const legoData = require("./modules/legoSets");

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme; 
  if (theme) {
    //if there is a theme parameter, respond with Lego data for that theme
    legoData.getSetsByTheme(theme)
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        res.status(404).send(error);
      });
  } else {
    //if there is no theme parameter, respond with all unfiltered Lego data
    legoData.getAllSets()
      .then(data => {
        res.json(data);
      })
      .catch(error => {
        res.status(404).send(error);
      });
  }
});

app.get("/lego/sets/:set_num", (req, res) => {
  const setNum = req.params.set_num; 
  legoData.getSetByNum(setNum)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(404).send(error);
    });
});

app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/views/404.html");
});

legoData.Initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Server is running on port " + HTTP_PORT);
    });
  })
  .catch(error => {
    console.error("Error initializing Lego data:", error);
  });
