const express = require("express");
const router = express.Router();

const overallStatus = require("../api/overallStatus/+controller");

// Utils
const catchAsync = require("../Utils/catchAsync");

//! type is student or staff
//! ampmStatus is am or pm

router.route("/export").get(catchAsync(overallStatus.exportOverallStatus));

router
  .route("/:type")
  .get(catchAsync(overallStatus.renderOverallStatus))
  .patch(catchAsync(overallStatus.updateOverallStatus));

router.route("/:type/:ampmStatus").get(catchAsync(overallStatus.renderReceipt));

module.exports = router;
