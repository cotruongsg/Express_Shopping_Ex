const express = require("express");
const app = express();
const itemRoutes = require("../Express_Shopping_List/itemRoutes");
const ExpressError = require("../Express_Shopping_List/expressError");

app.use(express.json());
debugger;
app.use("/items", itemRoutes);

// error-handling page not found
app.use(function (req, res, next) {
  const err = new ExpressError("PAGE NOT FOUND", 404);
  // In the modified implementation, the app.use() middleware function now calls the next() function with the error object as an argument instead of sending a response directly.
  // This passes the error object to the next middleware function in the stack, which is the error-handling middleware.
  return next(err);
});

// error-handling middleware
app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  // The error-handling middleware function uses the status and message properties of the error object to set the appropriate status code and message in the response to the client.
  // If the error object does not have a status or message property, default values are used.
  let status = err.status || 500;
  let message = err.message || "Something went wrong";

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});

// Server
app.listen(3000, () => {
  console.log("App on port 3000 is working....");
});

module.exports = app;
