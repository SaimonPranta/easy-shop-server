const path = require("path"); 

const storageDirectory = () => {
    const storageDir = path.join(__dirname, "../../../storage_easyshop50.com");
    return storageDir

}
const dailyTaskStorageDirectory = () => {
    const storageDir = path.join(storageDirectory(), "daily_task");
    return storageDir
}
const userTaskStorageDirectory = () => {
    const storageDir = path.join(storageDirectory(), "user_task_history");
    return storageDir
}



module.exports = { storageDirectory, dailyTaskStorageDirectory, userTaskStorageDirectory };