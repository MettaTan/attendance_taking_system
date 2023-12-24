module.exports = {
  adminLogin: (req, res) => {
    req.body.adminPW === "123" ? res.redirect("/admin") : res.redirect("/");
  },
  renderAdminPage: async (req, res) => {
    res.render("panel/admin", {
      header: "Admin Panel",
    });
  },
};
