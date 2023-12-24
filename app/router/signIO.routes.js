const express = require("express");
const router = express.Router();

const signIO = require("../api/signIO/+controller");
const catchAsync = require("../Utils/catchAsync");

router
  .route("/:signIO/:type")
  .get(catchAsync(signIO.renderForm))
  .post(catchAsync(signIO.signIO));

module.exports = router;
