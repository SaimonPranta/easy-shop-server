const router = require("express").Router()
const { createDailyTask, getDailyTask,dailyTaskList, createUserTaskHistory, taskApprove, userConfig, setConfig, userList, setUserPoints, spinInfo, adminGetTask, dailySelectTask, getDailyTaskDetails, editDailyTask, dailyTaskStatus, dailyDeleteTask } = require("../../collections/DailyTask/index");
const authGard = require("../../middleware/authGard");

//User Routes
router.get("/get-daily-task", authGard, getDailyTask)
router.post("/create-user-history", authGard, createUserTaskHistory)
router.post("/set-config", authGard, setConfig)
router.post("/set-user-points", authGard, setUserPoints)
router.get("/spin-info", authGard, spinInfo)



// Admin Routes
router.post("/admin-create-task", createDailyTask)
router.post("/admin-edit-task", editDailyTask)
router.post("/admin-user-list", userList)
router.get("/admin-get-task", adminGetTask)
router.post("/task-approve", taskApprove)
router.post("/daily-task-list", dailyTaskList)
router.post("/select-daily-task", dailySelectTask)
router.post("/delete-daily-task", dailyDeleteTask)
router.post("/daily-task-status", dailyTaskStatus)
router.get("/get-daily-task-details", getDailyTaskDetails)



module.exports = router;