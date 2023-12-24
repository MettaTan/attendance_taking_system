const express = require("express");
const router = express.Router();

const staff = require("../api/staff/staff.controller");
const forecast = require("../api/staff/forecast.controller");
const overallStatus = require("../api/staff/overallStatus.controller");
const schoolPersonnels = require("../api/staff/schoolPersonnels.controller");

// Utils
const catchAsync = require("../Utils/catchAsync");

router.route("/").get(staff.renderStaffPage).post(staff.staffLogin);

router
  .route("/schoolPersonnels")
  .get(catchAsync(schoolPersonnels.renderSchoolPersonnels))
  .post(catchAsync(schoolPersonnels.addSchoolPersonnel))
  .patch(catchAsync(schoolPersonnels.updateSchoolPersonnel))
  .delete(catchAsync(schoolPersonnels.deleteSchoolPersonnel));

router
  .route("/forecast")
  .get(catchAsync(forecast.renderForecastPage))
  .post(catchAsync(forecast.submitForecastPanel));

router
  .route("/overallStatus")
  .get(catchAsync(overallStatus.renderOverallStatus));

router
  .route("/schoolPersonnels/updateFutureStatus")
  .post(catchAsync(schoolPersonnels.updateFutureStatus));

module.exports = router;
