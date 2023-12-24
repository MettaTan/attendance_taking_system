module.exports = {
  staffLogin: (req, res) => {
    req.body.staffPW === "123" ? res.redirect("/staff") : res.redirect("/");
  },
  renderStaffPage: async (req, res) => {
    res.render("panel/staff", {
      header: "Staff Panel",
    });
  },
};
