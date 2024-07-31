const { storageDirectory } = require("../../constants/storageDirectory");
const DailyTaskList = require("../../db/schemas/dailyTaskList");
const UserTaskHIstory = require("../../db/schemas/userTaskHistory")
const DailyTasks = require("../../db/schemas/dailyTask");
const dateConverter = require("../../functions/YDM_to_date");
const { parseDate } = require("./utilities/index");
const testDate = require("./text");
const fs = require("fs");
const path = require("path");

const dailyTaskStorage = path.join(storageDirectory(), "daily_task")


exports.createDailyTask = async (req, res) => {
    try {
        const { title, description, taskLink, tutorialLink, autoApprove, taskStartDate, taskExpireDate } = JSON.parse(req.body.data)
        const image = req.files.img;

        let plainStartDate = parseDate("2024-07-11")

        let plainEndDate = dateConverter(taskStartDate)


        if (
            image.mimetype !== "image/jpg" &&
            image.mimetype !== "image/png" &&
            image.mimetype !== "image/jpeg"
        ) {
            res.status(500).send({ failed: "Only .jpg .png or .jpeg format allowed !" })
        } else if (image.size >= "3500012") {
            res.status(500).send({ failed: "Image Size are too large !" })
        } else {
            const extention = await image.mimetype.split("/")[1];
            image.name = await image.name.split(".")[0] + Math.floor(Math.random() * 10) + Date.now() + "." + extention;



            const taskListDocuments = await new DailyTaskList({
                taskStartDate: parseDate(taskStartDate, "Start Date"),
                taskExpireDate: parseDate(taskExpireDate, "Expire Date"),
                taskList: []
            });
            const data = await taskListDocuments.save();

            const additionalQuery = {}
            if (autoApprove) {
                additionalQuery["autoApprove"] = autoApprove
            } else {
                additionalQuery["autoApprove"] = false
            }
            if (tutorialLink) {
                additionalQuery["tutorialLink"] = tutorialLink
            }
            const dailyTaskDocuments = await new DailyTasks({
                taskListID: data._id,
                img: image.name,
                // title,
                description,
                taskLink,
                ...additionalQuery
            })
            const dailyTaskData = await dailyTaskDocuments.save()

            await DailyTaskList.findOneAndUpdate({ _id: data._id }, {
                currentTaskID: dailyTaskData._id,
                $push: {
                    taskList: {
                        $each: [
                            { taskID: dailyTaskData._id }
                        ],
                    }
                },
            })

            if (data._id) {
                if (!fs.existsSync(dailyTaskStorage)) {
                    fs.mkdirSync(dailyTaskStorage)
                }
                await image.mv(`${dailyTaskStorage}/${image.name}`);

                res.status(201).json({
                    data: data,
                    message: "successfully added product"
                })
            } else {
                res.status(417).json({
                    message: "failed to add product"
                })
            }

        }

        // res.json({
        //     message: "Success"
        // })
    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Internal server error"

        })
    }
}

exports.getDailyTask = async (req, res) => {
    try {
        let allTask = await DailyTaskList.aggregate([
            {
                $lookup: {
                    from: "daily_tasks",
                    localField: "currentTaskID",
                    foreignField: "_id",
                    as: "currentTaskID"
                }
            }, {
                $unwind: "$currentTaskID"
            }
        ])
        const userDailyTask = await UserTaskHIstory.find({ userID: req.id })
        allTask = await Promise.all(allTask.map(async (task, i) => {
            const isTaskComplete = await UserTaskHIstory.findOne({ userID: req.id, taskListID: task._id })
            if (i === 3) {
                return {
                    ...task,
                    isTaskComplete: true
                }
            }
            return {
                ...task,
                isTaskComplete: isTaskComplete ? true : false
            }
        }))
        console.log("allTask", allTask)
        res.json({
            message: "Successfully get daily task",
            data: [...allTask]
        })
    } catch (error) {
        res.json({
            message: "Internal server error"
        })
    }
}

exports.userDailyTask = async (req, res) => {
    try {

        const userDailyTask = UserTaskHIstory
    } catch (error) {
        console.log("error", error)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

