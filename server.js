/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name:Ali Rezk   Student ID: 105593222   Date:11/132023
*
*  Published URL: https://defiant-blue-shawl.cyclic.app/
*
********************************************************************************/



const express = require("express");
const app = express();
app.set('view engine', 'ejs');
const HTTP_PORT = process.env.PORT || 8080;
const legoData = require("./modules/legoSets");

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about"); 
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme; 
  if (theme) {
    legoData.getSetsByTheme(theme)
      .then(data => {
        res.render("sets", { sets: data }); 
      })
      .catch(error => {
        res.status(404).send(error);
      });
  } else {
    legoData.getAllSets()
      .then(data => {
        res.render("sets", { sets: data });
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
      res.render("set", { set: data }); 
    })
    .catch(error => {
      res.status(404).send(error);
    });
});


app.use((req, res) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
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
