const path = require("path");

const storageDirectory = () => {
    const storageDir = path.join(__dirname, "../../../../storage.imp/easyshop50.com");
    // const storageDir = path.join(__dirname, "../../../storage.imp/easyshop50.com");
    return storageDir

}
// const storageDirectory = () => {
//     const storageDir = path.join(__dirname, "../../../storage_easyshop50.com");
//     return storageDir
// }
const dailyTaskStorageDirectory = () => {
    const storageDir = path.join(storageDirectory(), "daily_task");
    return storageDir
}
const userTaskStorageDirectory = () => {
    const storageDir = path.join(storageDirectory(), "user_task_history");
    return storageDir
}
const productDirectory = () => {
    const storageDir = path.join(storageDirectory(), "product_images");
    return storageDir
}
const sliderDirectory = () => {
    const storageDir = path.join(storageDirectory(), "slider_images");
    return storageDir
}
const helpSocialDirectory = () => {
    const storageDir = path.join(storageDirectory(), "help_social");
    return storageDir
}
const notificationDirectory = () => {
    const storageDir = path.join(storageDirectory(), "notification");
    return storageDir
}
const profileDirectory = () => {
    const storageDir = path.join(storageDirectory(), "profile_picture");
    return storageDir
}
const transactionDirectory = () => {
    const storageDir = path.join(storageDirectory(), "transaction");
    return storageDir
}
const ranksDirectory = () => {
    const storageDir = path.join(storageDirectory(), "ranks");
    return storageDir
}
const proveDirectory = () => {
    const storageDir = path.join(storageDirectory(), "prove");
    return storageDir
}
const categoriesDirectory = () => {
    const storageDir = path.join(storageDirectory(), "categories");
    return storageDir
}



module.exports = {
    storageDirectory,
    dailyTaskStorageDirectory,
    userTaskStorageDirectory,
    productDirectory,
    sliderDirectory,
    helpSocialDirectory,
    notificationDirectory,
    profileDirectory,
    transactionDirectory, 
    ranksDirectory,
    proveDirectory,
    categoriesDirectory,
};

