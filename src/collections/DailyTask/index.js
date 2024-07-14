exports.createDailyTask = async (req, res) => {
    try {
        const data = JSON.parse(req.body.data)
        console.log("req.body", req.body)
        console.log("req ===>>", req.files)
        console.log("req ===>>", JSON.parse(req.body.data))
        res.json({
            message: "Success"
        })
    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Internal server error"

        })
    }
}