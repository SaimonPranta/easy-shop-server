const router = require("express").Router()
const { createDailyTask, getDailyTask, createUserTaskHistory, userConfig, setConfig } = require("../../collections/DailyTask/index");
const authGard = require("../../middleware/authGard");

//User Routes
router.get("/get-daily-task", authGard, getDailyTask)
router.post("/create-user-history", authGard, createUserTaskHistory)
router.post("/set-config", authGard, setConfig)



// Admin Routes
router.post("/admin-create-task", createDailyTask)



module.exports = router;