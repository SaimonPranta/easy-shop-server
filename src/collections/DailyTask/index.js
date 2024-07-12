exports.createDailyTask = async (req, res) => {
    try {
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