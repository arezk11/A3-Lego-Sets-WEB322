const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.all("/check", (req, res) => {
  res.status(200).end();
});
app.listen(HTTP_PORT, () => {
    console.log("Server is running on port " + HTTP_PORT);
});

const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.get("/productID/:id", (req, res) => {
  const productId = req.params.id;
  const responseObject = { productID: productId };
  res.send(responseObject);
});

app.listen(HTTP_PORT, () => {
    console.log("Server is running on port " + HTTP_PORT);
});

