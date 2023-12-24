const { Status } = require("../../../models/Status.model");
const Personnel = require("../../../models/Personnel.model");
const moment = require("moment-timezone");

const getTodaysDate = () => {
  return moment().startOf("day").format("DD/MM/YYYY");
};

const getDormPersonnelIdFromStatus = (dormPersonnelStatuses) => {
  const dormPersonnelIds = [];

  dormPersonnelStatuses.forEach((status) => {
    const id = status.personnel;
    dormPersonnelIds.push(id);
  });
  return dormPersonnelIds;
};

const createNewStatus = async (id) => {
  const person = await Personnel.findById(id);

  const newStatus = new Status({
    date: getTodaysDate(),
    faculty: person.faculty,
    personnel: person,
    signin: {
      signin: true,
    },
    status: {
      AM: "PRESENT",
      PM: "PRESENT",
    },
  });
  await newStatus.save();
  person.statuses.push(newStatus);
  await person.save();
  return;
};

module.exports = {
  getDormPersonnelIds: async (prevDay) => {
    const dormPersonnelStatuses = await Status.find({
      "status.PM": "PRESENT",
      "signout.signout": false,
      date: prevDay,
    });
    return getDormPersonnelIdFromStatus(dormPersonnelStatuses);
  },
  createStatusesForDorm: async (id) => {
    for (let i = 0; i < id.length; i++) {
      await createNewStatus(id[i]);
    }
    return;
  },
  getAllPersonnelsId: async () => {
    const allPersonnelsId = [];
    const allPersonnels = await Personnel.find();
    allPersonnels.forEach((person) => {
      allPersonnelsId.push(person._id.valueOf());
    });
    return allPersonnelsId;
  },
  personnelsWithExistingStatus: async () => {
    let personnelsWithExistingStatus = [];
    const statuses = await Status.find({ date: getTodaysDate() });

    statuses.forEach((status) => {
      const id = status.personnel;
      personnelsWithExistingStatus.push(id.valueOf());
    });
    return personnelsWithExistingStatus;
  },
  removePersonnelWithExistingStatus: (
    allPersonnelsExistingStatusId,
    allPersonnelsId
  ) => {
    for (let i = 0; i < allPersonnelsExistingStatusId.length; i++) {
      const index = allPersonnelsId.indexOf(allPersonnelsExistingStatusId[i]);
      switch (index) {
        case -1:
          break;
        default:
          allPersonnelsId.splice(index, 1);
          break;
      }
    }
    return allPersonnelsId;
  },
  seedPersonnelWithNoStatus: async (personnelsId) => {
    for (let i = 0; i < personnelsId.length; i++) {
      const person = await Personnel.findById(personnelsId[i]);
      const newStatus = new Status({
        date: getTodaysDate(),
        department: person.faculty,
        personnel: person,
      });
      await newStatus.save();
      person.statuses.push(newStatus);
      await person.save();
    }
    return;
  },
};
