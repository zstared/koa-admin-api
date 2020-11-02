"use strict";
import Router from "koa-router";
import tableController from "../../controller/core/table";

const table = new Router({
  prefix: "/core/table",
});

table.get("/columns", tableController.columns);
table.get("/list", tableController.list);
table.post("/createColumn", tableController.createColumn);
table.post("/updateColumn", tableController.updateColumn);
table.post("/deleteColumn", tableController.deleteColumn);

module.exports = table;
