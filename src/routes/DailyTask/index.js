const router = require("express").Router()
const { createDailyTask, getDailyTask, createUserTaskHistory } = require("../../collections/DailyTask/index");
const authGard = require("../../middleware/authGard");

//User Routes
router.get("/get-daily-task", authGard, getDailyTask)
router.post("/create-user-history", authGard, createUserTaskHistory)



// Admin Routes
router.post("/admin-create-task", createDailyTask)



module.exports = router;