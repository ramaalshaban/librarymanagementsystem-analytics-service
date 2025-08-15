module.exports = (headers) => {
  // ChangeStreamEvent Db Object Rest Api Router
  const changeStreamEventMcpRouter = [];
  // getChangeStreamEvent controller
  changeStreamEventMcpRouter.push(require("./get-changestreamevent")(headers));
  // createChangeStreamEvent controller
  changeStreamEventMcpRouter.push(
    require("./create-changestreamevent")(headers),
  );
  // deleteChangeStreamEvent controller
  changeStreamEventMcpRouter.push(
    require("./delete-changestreamevent")(headers),
  );
  // listChangeStreamEvents controller
  changeStreamEventMcpRouter.push(
    require("./list-changestreamevents")(headers),
  );
  return changeStreamEventMcpRouter;
};
