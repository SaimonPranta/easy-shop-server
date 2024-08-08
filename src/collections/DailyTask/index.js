const { storageDirectory, userTaskStorageDirectory } = require("../../constants/storageDirectory");
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
        res.json({
            message: "Internal server error"

        })
    }
}

exports.getDailyTask = async (req, res) => {
    try {
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        let allTask = await DailyTaskList.aggregate([
            {
                $match: {
                    $or: [
                        { taskStartDate: { $lte: endOfDay }, taskExpireDate: { $gte: startOfDay } }, // Date range includes today
                        { taskStartDate: { $gte: startOfDay, $lte: endOfDay } }, // taskStartDate is today
                        // { taskExpireDate: { $gte: startOfDay, $lte: endOfDay } }  // taskExpireDate is today
                    ]
                }
            },
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

        let isCompletedTask = true
        allTask = await Promise.all(allTask.map(async (task, i) => {
            const isTaskComplete = await UserTaskHIstory.findOne({
                userID: req.id, taskListID: task._id, $and: [
                    { createdAt: { $gte: startOfDay } },
                    { createdAt: { $lte: endOfDay } },
                ]
            })
            if (!isTaskComplete) {
                isCompletedTask = false
            }
            return {
                ...task,
                isTaskComplete: isTaskComplete ? true : false
            }
        }))
        res.json({
            message: "Successfully get daily task",
            data: [...allTask],
            isCompletedTask,
        })
    } catch (error) {
        res.json({
            message: "Internal server error"
        })
    }
}

exports.createUserTaskHistory = async (req, res) => {
    try {
        const { taskListID, dailyTaskID } = req.body
        const files = req.files || {}
        const id = req.id
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        let images = []
        let imageString = []

        await Object.entries(files).map(([key, img]) => {
            const fileExt = path.extname(img.name);
            let fileName = img.name.replace(fileExt, "")
            fileName = fileName + Math.floor(Math.random() * 10) + Date.now()
            fileName = fileName + fileExt
            img.name = fileName

            imageString.push(fileName)
            images.push(img)
        });

        const isTaskComplete = await UserTaskHIstory.findOne({
            userID: id, taskListID: taskListID,
            $and: [
                { createdAt: { $gte: startOfDay } },
                { createdAt: { $lte: endOfDay } },
            ]
        })

        if (isTaskComplete) {
            return res.json({
                message: "This task already completed"
            })
        }

        const userTaskHistoryDocument = await new UserTaskHIstory({
            taskListID,
            dailyTaskID,
            userID: id,
            images: [...imageString]
        })
        const userTaskHistoryData = await userTaskHistoryDocument.save()

        if (userTaskHistoryData) {
            await DailyTaskList.findOneAndUpdate(
                { _id: taskListID },
                { $inc: { taskCompleteCount: 1 } },
                { new: true }
            )
            await DailyTasks.findOneAndUpdate(
                { _id: dailyTaskID },
                { $inc: { taskCompleteCount: 1 } },
                { new: true }
            )
            await images.forEach(async (imgInfo) => {

                if (!fs.existsSync(userTaskStorageDirectory())) {
                    await fs.mkdirSync(path.join(storageDirectory(), "user_task_history"))
                }
                const filepath = path.join(userTaskStorageDirectory(), imgInfo.name)
                await imgInfo.mv(`${userTaskStorageDirectory()}/${imgInfo.name}`)

            })

        }

        res.json({
            message: "Successfully, your task is completed",
            taskListID: taskListID,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}
exports.userConfig = async (req, res) => {
    try {
        const { taskListID, dailyTaskID } = req.body
        const files = req.files || {}
        const id = req.id
        const today = new Date()
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        let images = []
        let imageString = []

        await Object.entries(files).map(([key, img]) => {
            const fileExt = path.extname(img.name);
            let fileName = img.name.replace(fileExt, "")
            fileName = fileName + Math.floor(Math.random() * 10) + Date.now()
            fileName = fileName + fileExt
            img.name = fileName

            imageString.push(fileName)
            images.push(img)
        });

        const isTaskComplete = await UserTaskHIstory.findOne({
            userID: id, taskListID: taskListID,
            $and: [
                { createdAt: { $gte: startOfDay } },
                { createdAt: { $lte: endOfDay } },
            ]
        })

        if (isTaskComplete) {
            return res.json({
                message: "This task already completed"
            })
        }

        const userTaskHistoryDocument = await new UserTaskHIstory({
            taskListID,
            dailyTaskID,
            userID: id,
            images: [...imageString]
        })
        const userTaskHistoryData = await userTaskHistoryDocument.save()

        if (userTaskHistoryData) {
            await DailyTaskList.findOneAndUpdate(
                { _id: taskListID },
                { $inc: { taskCompleteCount: 1 } },
                { new: true }
            )
            await DailyTasks.findOneAndUpdate(
                { _id: dailyTaskID },
                { $inc: { taskCompleteCount: 1 } },
                { new: true }
            )
            await images.forEach(async (imgInfo) => {

                if (!fs.existsSync(userTaskStorageDirectory())) {
                    await fs.mkdirSync(path.join(storageDirectory(), "user_task_history"))
                }
                const filepath = path.join(userTaskStorageDirectory(), imgInfo.name)
                await imgInfo.mv(`${userTaskStorageDirectory()}/${imgInfo.name}`)

            })

        }

        res.json({
            message: "Successfully, your task is completed",
            taskListID: taskListID,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

