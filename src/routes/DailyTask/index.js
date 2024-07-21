const router = require("express").Router()
const { createDailyTask, getDailyTask } = require("../../collections/DailyTask/index")

//User Routes
router.get("/get-daily-task", getDailyTask)



// Admin Routes
router.post("/admin-create-task", createDailyTask)



module.exports = router;