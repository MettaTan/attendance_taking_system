const {
  findSchoolPersonnels,
  addSchoolPersonnel,
  updateSchoolPersonnel,
  deleteSchoolPersonnel,
  updateStatus,
} = require("../admin/schoolPersonnels/+services");

module.exports = {
  renderSchoolPersonnels: async (req, res) => {
    const studentPersonnels = await findSchoolPersonnels("student");
    const staffPersonnels = await findSchoolPersonnels("staff");

    res.render("panel/schoolPersonnels", {
      header: "Dokki University Personnels",
      studentPersonnels,
      staffPersonnels,
      type: "staff",
    });
  },
  addSchoolPersonnel: async (req, res) => {
    const person = req.body.person;
    await addSchoolPersonnel(person);
    res.redirect("/admin/schoolPersonnels");
  },

  updateSchoolPersonnel: async (req, res) => {
    const person = req.body.person;
    await updateSchoolPersonnel(person);
    res.redirect("/admin/schoolPersonnels");
  },
  deleteSchoolPersonnel: async (req, res) => {
    const { _id } = req.body.person;
    await deleteSchoolPersonnel(_id);
    res.redirect("/admin/schoolPersonnels");
  },
  updateFutureStatus: async (req, res) => {
    await updateStatus(req.body);
    res.redirect("/admin/schoolPersonnels");
  },
};
