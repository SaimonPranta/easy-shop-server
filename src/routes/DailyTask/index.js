const router = require("express").Router()
const { createDailyTask, getDailyTask, createUserTaskHistory, taskApprove, userConfig, setConfig, userList, setUserPoints, spinInfo, adminGetTask } = require("../../collections/DailyTask/index");
const authGard = require("../../middleware/authGard");

//User Routes
router.get("/get-daily-task", authGard, getDailyTask)
router.post("/create-user-history", authGard, createUserTaskHistory)
router.post("/set-config", authGard, setConfig)
router.post("/set-user-points", authGard, setUserPoints)
router.get("/spin-info", authGard, spinInfo)



// Admin Routes
router.post("/admin-create-task", createDailyTask)
router.get("/admin-user-list", userList)
router.get("/admin-get-task", adminGetTask)
router.post("/task-approve", taskApprove)



module.exports = router;