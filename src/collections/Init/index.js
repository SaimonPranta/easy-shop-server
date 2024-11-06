const Configs = require("../../db/schemas/Configs")

exports.getConfigs = async (req, res) => {
    try {
        const configs = await Configs.findOne({})

        res.json({
            success: true,
            data: configs || {}
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}