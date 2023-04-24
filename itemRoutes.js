const express = require("express");
const ExpressError = require("../expressError");
const router = new express.Router();
const itemsDB = require("./fakeDb");

// const ITEMS = [
//   { name: "popsicle", price: 1.45 },
//   { name: "cheerios", price: 3.4 },
// ];

// GET /items - this should render a list of shopping items.
// Here is what a response looks like:
// [{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]

router.get("/", function (req, res) {
  res.json({ itemsDB });
});

// POST /items - this route should accept JSON data and add it to the shopping list.
// Here is what a sample request/response looks like:
// {“name”:”popsicle”, “price”: 1.45} => {“added”: {“name”: “popsicle”, “price”: 1.45}}

router.post("/", function (req, res, next) {
  try {
    if (!req.body.name && !req.body.price)
      throw new ExpressError("NAME IS REQUIRED", 400);
    const newItem = { name: req.body.name, price: req.body.price };
    itemsDB.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

// GET /items/:name - this route should display a single item’s name and price.
// Here is what a sample response looks like:
// {“name”: “popsicle”, “price”: 1.45}

router.get("/:name", function (req, res) {
  const foundItem = itemsDB.find((i) => i.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  return res.json({ item: foundItem });
});

// PATCH /items/:name, this route should modify a single item’s name and/or price.
// Here is what a sample request/response looks like:
// {“name”:”new popsicle”, “price”: 2.45} => {“updated”: {“name”: “new popsicle”, “price”: 2.45}}

router.patch("/:name", function (req, res) {
  // the foundItem variable will contain that item object if found
  // foundItem = {“name”:”new popsicle”, “price”: 2.45}
  const foundItem = itemsDB.find((i) => i.name === req.params.name);
  if (foundItem === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  foundItem.name = req.body.name;
  return res.json({ updated: foundItem });
});

// DELETE /items/:name - this route should allow you to delete a specific item from the array.
// Here is what a sample response looks like:
// {message: “Deleted”}

router.delete("/:name", function (req, res) {
  const nameTobeDeleted = req.params.name;
  const foundItem = itemsDB.findIndex((cat) => cat.name === req.params.name);
  if (foundItem === -1) {
    throw new ExpressError("Item not found", 404);
  }
  itemsDB.splice(foundItem, 1);
  return res.json({ message: `Deleted ${nameTobeDeleted}` });
});

module.exports = router;
