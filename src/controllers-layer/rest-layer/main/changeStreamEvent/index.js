const express = require("express");

// ChangeStreamEvent Db Object Rest Api Router
const changeStreamEventRouter = express.Router();

// add ChangeStreamEvent controllers

// getChangeStreamEvent controller
changeStreamEventRouter.get(
  "/changestreamevents/:changeStreamEventId",
  require("./get-changestreamevent"),
);
// createChangeStreamEvent controller
changeStreamEventRouter.post(
  "/changestreamevents",
  require("./create-changestreamevent"),
);
// deleteChangeStreamEvent controller
changeStreamEventRouter.delete(
  "/changestreamevents/:changeStreamEventId",
  require("./delete-changestreamevent"),
);
// listChangeStreamEvents controller
changeStreamEventRouter.get(
  "/changestreamevents",
  require("./list-changestreamevents"),
);

module.exports = changeStreamEventRouter;
