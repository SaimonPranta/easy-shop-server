const router = require("express").Router()
const { createDailyTask } = require("../../collections/DailyTask/index")


router.post("/admin-create-task", createDailyTask)



module.exports = router;