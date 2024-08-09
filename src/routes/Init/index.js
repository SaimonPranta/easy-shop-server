const router = require("express").Router()
const { getConfigs } = require("../../collections/Init/index");
const authGard = require("../../middleware/authGard");

//User Routes
router.get("/get-configs",  getConfigs)
 



module.exports = router;