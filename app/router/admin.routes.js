const express = require("express");
const router = express.Router();

// Admin Menu
const admin = require("../api/admin/admin.controller");
const schoolPersonnels = require("../api/admin/schoolPersonnels/+controller");
const adminForecast = require("../api/admin/forecast/+controller");
const overallStatus = require("../api/admin/overallStatus/+controller");

// Utils
const catchAsync = require("../Utils/catchAsync");

router.route("/").get(admin.renderAdminPage).post(admin.adminLogin);

router
  .route("/schoolPersonnels")
  .get(catchAsync(schoolPersonnels.renderSchoolPersonnels))
  .post(catchAsync(schoolPersonnels.addSchoolPersonnel))
  .patch(catchAsync(schoolPersonnels.updateSchoolPersonnel))
  .delete(catchAsync(schoolPersonnels.deleteSchoolPersonnel));

router
  .route("/forecast")
  .get(catchAsync(adminForecast.renderForecastPage))
  .post(catchAsync(adminForecast.submitForecastPanel));

router
  .route("/overallStatus")
  .get(catchAsync(overallStatus.renderOverallStatus));

router
  .route("/schoolPersonnels/updateFutureStatus")
  .post(catchAsync(schoolPersonnels.updateFutureStatus));

module.exports = router;
