const Categories = require("../../db/schemas/categories")

const router = require("express").Router()

router.get("/", async (req, res) => {
    try {

        const data = await Categories.find()
        res.json({
            success: true,
            data: data
        })
    } catch (error) { 
        res.json({
            success: false,
            message: "Internal server error"
        })
    }
})


module.exports = router; 