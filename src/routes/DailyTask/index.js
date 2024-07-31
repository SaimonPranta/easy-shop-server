const router = require("express").Router()
const { createDailyTask, getDailyTask } = require("../../collections/DailyTask/index");
const authGard = require("../../middleware/authGard");

//User Routes
router.get("/get-daily-task", authGard, getDailyTask)



// Admin Routes
router.post("/admin-create-task", createDailyTask)



module.exports = router;