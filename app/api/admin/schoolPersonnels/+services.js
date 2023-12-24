const Personnel = require("../../../models/Personnel.model");
const { Status } = require("../../../models/Status.model");

const moment = require("moment-timezone");
let date = moment().tz("Asia/Makassar").format("DD/MM/YYYY");

setInterval(() => {
  date = moment().tz("Asia/Makassar").format("DD/MM/YYYY");
}, 1500);

const returnLast10Elements = (statuses) => {
  const last10Elements = statuses.slice(statuses.length - 10, statuses.length);
  return last10Elements;
};

module.exports = {
  findSchoolPersonnels: async (type) => {
    let allPersonnels = await Personnel.find({ type })
      .sort({
        faculty: 1,
        name: 1,
      })
      .populate("statuses");

    allPersonnels.forEach((personnel) => {
      const statuses = personnel.statuses;
      personnel.statuses = returnLast10Elements(statuses);
    });
    return allPersonnels;
  },
  addSchoolPersonnel: async (person) => {
    const { type, faculty, name, nric, hp } = person;
    const personnel = new Personnel({
      name,
      hp,
      nric,
      faculty,
      type,
    });
    const newStatus = new Status({
      personnel,
      date,
      faculty,
    });
    personnel.statuses.push(newStatus);
    await personnel.save();
    await newStatus.save();
    return;
  },
  updateSchoolPersonnel: async (person) => {
    const { _id, name, hp, faculty } = person;
    const personnel = await Personnel.findOne({ _id });
    personnel.name = name;
    personnel.hp = hp;
    personnel.faculty = faculty;
    await personnel.save();
    return;
  },
  deleteSchoolPersonnel: async (id) => {
    const personnel = await Personnel.findById(id).populate("statuses");
    const { statuses } = personnel;

    for (let i = 0; i < statuses.length; i++) {
      const { _id } = statuses[i];
      await Status.findByIdAndDelete(_id);
    }
    await Personnel.findByIdAndDelete(id);

    return;
  },
  updateStatus: async (obj) => {
    const { _id, am, pm } = obj;
    let status = await Status.findById(_id);
    status.status.AM = am.reason;
    status.status.amRemarks = am.remarks;
    status.status.PM = pm.reason;
    status.status.pmRemarks = pm.remarks;
    await status.save();
    return;
  },
};
