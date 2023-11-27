/********************************************************************************
*  WEB322 – Assignment 05
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
require('dotenv').config();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

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

app.get("/lego/addSet", (req, res) => {
  legoData
    .getAllThemes()
    .then((themeData) => res.render("addSet", { themes: themeData }))
    .catch((err) =>
      res.status(404).render("404", {
        message: `${err.message}`,
      })
    );
});

app.post("/lego/addSet", (req, res) => {
  legoData.addSet(req.body) 
    .then(() => res.redirect("/lego/sets"))
    .catch((err) => {
      console.error(err);
      res.status(500).render("500", {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      });
    });
});

app.get('/lego/editSet/:num', async (req, res) => {
  try {
    const [set, themes] = await Promise.all([
      legoData.getSetByNum(req.params.num),
      legoData.getAllThemes(),
    ]);

    res.render('editSet', { set, themes });
  } catch (error) {
    res.status(404).render('404', { message: error.message });
  }
});

// POST route to update the set
app.post('/lego/editSet', async (req, res) => {
  try {
    const setData = {
      name: req.body.name,
      year: req.body.year,
      num_parts: req.body.num_parts,
      img_url: req.body.img_url,
      theme_id: req.body.theme_id,
      set_num: req.body.set_num,
    };

    await legoData.editSet(req.body.set_num, setData);

    res.redirect('/lego/sets');
  } catch (error) {
    res.status(500).render('500', { message: `Error editing set: ${error.message}` });
  }
});

app.get("/lego/deleteSet/:num", async (req, res) => {
  legoData
    .deleteSet(req.params.num)
    .then(() => res.redirect("/lego/sets"))
    .catch((err) =>
      res.render("500", {
        message: `I'm sorry, but we have encountered the following error: ${err}`,
      })
    );
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
