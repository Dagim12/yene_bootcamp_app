const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const User = require("../models/user");

const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

//Anything below this will be protected
router.use(protect);
router.use(authorize("admin"));
router.route("/").get(advancedResults(User), getAllUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
