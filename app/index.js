// PACKAGES
const express = require("express");
const app = express();
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const moment = require("moment-timezone");

//FILES
const ExpressError = require("./Utils/ExpressError");

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.set("layout extractScripts", true);

setInterval(async () => {
  // change the time here to seed day statuses
  const midnight = "00:00:00";
  const currentTime = moment().startOf("second").format("HH:mm:ss");

  const prevDay = moment()
    .startOf("day")
    .subtract(1, "days")
    .format("DD/MM/YYYY");

  if (currentTime == midnight) {
    seedDay(prevDay);
  }
}, 1000);

const {
  getDormPersonnelIds,
  createStatusesForDorm,
  getAllPersonnelsId,
  personnelsWithExistingStatus,
  removePersonnelWithExistingStatus,
  seedPersonnelWithNoStatus,
} = require("./public/javascripts/seedNextDay/seedNextDay");

// * Seeding of Personnels in the day
const seedDay = async (prevDay) => {
  const dormPersonnelIds = await getDormPersonnelIds(prevDay);
  await createStatusesForDorm(dormPersonnelIds);

  const allPersonnelsId = await getAllPersonnelsId();
  const allPersonnelsExistingStatusId = await personnelsWithExistingStatus();

  const remainingPersonnelsWithNoStatusId =
    await removePersonnelWithExistingStatus(
      allPersonnelsExistingStatusId,
      allPersonnelsId
    );

  await seedPersonnelWithNoStatus(remainingPersonnelsWithNoStatusId);
};

app.get("/", (req, res) => {
  res.render("home", {
    header: "Welcome to Dokki University!",
  });
});

//ROUTES FOR CONTROLLERS
const signIO = require("./router/signIO.routes");
app.use("/signIO", signIO);

const overallStatus = require("./router/overallStatus.routes");
app.use("/overallStatus", overallStatus);

const admin = require("./router/admin.routes");
app.use("/admin", admin);

const staff = require("./router/staff.routes");
app.use("/staff", staff);

// ! Only for development
// app.get("/seed", (req, res) => {
//     seedDay("12/02/2023");
//     res.send("Seeded");
// });

//ERROR HANDLING
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message =
      "Something went wrong, inform Metta on the bug you experienced";
  }
  res.status(statusCode).render("error", { err });
});

module.exports = app;
