"use strict";
import Router from "koa-router";
import tableController from "../../controller/core/table";

const table = new Router({
  prefix: "/core/table",
});

table.get("/columns", tableController.columns);

module.exports = table;
