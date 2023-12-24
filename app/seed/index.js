const express = require("express");
require("dotenv").config();
const app = express(),
  express_port = process.env.EXPRESS_PORT,
  express_ip = process.env.EXPRESS_IP,
  mongodb_host = process.env.MONGODB_HOST,
  mongodb_port = process.env.MONGODB_PORT;

const { Status } = require("../models/Status.model");
const Personnel = require("../models/Personnel.model");

const mongoose = require("mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    `mongodb://${mongodb_host}:${mongodb_port}/attendance_system`
  );
}

const moment = require("moment-timezone");
const today = moment().startOf("day").format("DD/MM/YYYY");
const nextDay = moment().startOf("day").add(1, "days").format("DD/MM/YYYY");

const { students, staff } = require("./dokki");

const seedStudents = async () => {
  for (const [faculty, facultyStudent] of Object.entries(students)) {
    facultyStudent.forEach(async (student) => {
      const studentPersonnel = new Personnel({
        name: student.name,
        hp: student.hp,
        nric: student.nric,
        faculty,
        type: "student",
      });
      await studentPersonnel.save();
    });
  }
  return;
};
const seedStaff = async () => {
  for (const [faculty, facultyStaff] of Object.entries(staff)) {
    facultyStaff.forEach(async (staff) => {
      const staffPersonnel = new Personnel({
        name: staff.name,
        hp: staff.hp,
        nric: staff.nric,
        faculty,
        type: "staff",
      });
      await staffPersonnel.save();
    });
  }
  return;
};

app.get("/", async (req, res) => {
  const seedDay = async (date) => {
    // await Status.deleteMany();
    const allPersonnels = await Personnel.find();
    for (let i = 0; i < allPersonnels.length; i++) {
      const newStatus = new Status({
        date,
        faculty: allPersonnels[i].faculty,
        personnel: allPersonnels[i],
        // status: {
        //     AM: "PRESENT",
        // },
      });
      await newStatus.save();
      allPersonnels[i].statuses.push(newStatus);
      await allPersonnels[i].save();
    }
  };
  await seedDay(today);
  //await seedDay(nextDay);
});
app.get("/personnel", async (req, res) => {
  await seedStudents();
  await seedStaff();
});

app.listen(express_port, async () => {
  const date_obj = new Date();
  console.log(`Time: ${date_obj}`);
  console.log(
    `Attendance_Taking_System listening on port http://${express_ip}:${express_port}`
  );
  console.log(`Database connected to ${mongodb_host}:${mongodb_port}`);
  console.log("----------------------------------");
});
