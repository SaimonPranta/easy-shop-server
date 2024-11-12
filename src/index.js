const express = require('express');
const cors = require('cors');
require("./db/connection");
const user_collection = require("./db/schemas/user_schema");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const authGard = require('./middleware/authGard');
const root = require("./routes/root")
const registation = require("./routes/user_routes/registation");
const login = require("./routes/user_routes/login");
const read_user = require("./routes/user_routes/read_user");
const update_user = require("./routes/user_routes/update_user");
const password_reset = require("./routes/user_routes/password_reset");
const balance_transfer = require("./routes/user_routes/balance_transfer (old) ");
const balance_request = require("./routes/user_routes/balance_request");
const mobile_rechare = require("./routes/user_routes/mobile_recharge");
const withdraw = require("./routes/user_routes/withdraw");
const SalaryRoutes = require("./routes/user_routes/salary");
const publicProve = require("./routes/user_routes/publicProve");
const prove = require("./routes/user_routes/prove");
const adminWithdraw = require("./routes/user_routes/admin_withdraw");
const adminBalanceTransfer = require("./routes/user_routes/admin_balance_transfer");
const adminProve = require("./routes/user_routes/admin_Prove_Post");
const adminPayments = require("./routes/user_routes/admin_payments");
const adminSalary = require("./routes/user_routes/admin_salary");
const generation_list = require("./routes/user_routes/generation_list");
const adminAuthGard = require("./middleware/adminAuthGard");
const all_user = require("./routes/admin_routes/all_user");
const pubLicAllUser = require("./routes/user_routes/all_user");
const user_dtails = require("./routes/admin_routes/user_dtails");
const balance_approval = require("./routes/admin_routes/blanace_approval");
const mobile_recharge_approval = require('./routes/admin_routes/mobile_recharge_approval');
const mobile_recharge_decline = require('./routes/admin_routes/mobile_recharge_decline');
const balance_request_decline = require('./routes/admin_routes/balance_request_decline');
const withdraw_request_approval = require('./routes/admin_routes/withdraw_request_approval');
const withdraw_request_decline = require('./routes/admin_routes/withdraw_request_decline');
const add_slider_img = require('./routes/admin_routes/add_slider_img');
const user_activation = require('./routes/user_routes/user_activation');
const slider_provider = require('./routes/user_routes/slider_provider');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs-extra');


const slider_img_delete = require('./routes/admin_routes/slider_img_delete');
const generation_user = require('./routes/user_routes/generation_user');
const admin_update_user = require('./routes/admin_routes/admin_update_user');
const read_notice = require('./routes/user_routes/read_notice');
const add_notice = require('./routes/admin_routes/add_notice');
const userCount = require('./routes/admin_routes/userCount');
const balanceRequest = require('./routes/admin_routes/balanceRequest');
const balanceRequestList = require('./routes/admin_routes/balanceRequestList');
const withdrawRequestList = require('./routes/admin_routes/withdrawRequestList');
const rechargeRequestList = require('./routes/admin_routes/rechargeRequestList');
const rechargeRequest = require('./routes/admin_routes/rechargeRequest');
const withdrawRequest = require('./routes/admin_routes/withdrawRequest');
const adminConfig = require('./routes/user_routes/admin_config');
const payments = require('./routes/user_routes/payments');
const profileRoutes = require('./routes/profile/index');
const adminProfileRoutes = require('./routes/admin_profile/index');
const adminCategories = require('./routes/admin_routes/admin_categories');
const userCategories = require('./routes/user_routes/user_categories');
const helpLineSocial = require('./routes/admin_routes/helpLine');
const adminNotification = require('./routes/admin_routes/notification');
const notification = require('./routes/user_routes/notification');
const dailyTaskRoutes = require("./routes/DailyTask/index");
const balanceTransfer = require("./routes/user_routes/balance_transfer");
const tutorial = require("./routes/user_routes/tutorial");
const adminTutorial = require("./routes/user_routes/admin_tutorial");
const adminDashboard = require ("./routes/user_routes/admin_dashboard");
const dashboard = require ("./routes/user_routes/dashboard");



const { 
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
    socialDirectory,
} = require('./constants/storageDirectory');
// const filter_delete_user = require('./functions/filter_delete_user');
require("./testGround")
const app = express();
dotenv.config()

const port = process.env.PORT || 8000


// ====== Middleware ======
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload());

app.use(express.static(productDirectory()))
app.use(express.static(sliderDirectory()))
app.use(express.static(helpSocialDirectory()))
app.use(express.static(notificationDirectory()))
app.use(express.static(dailyTaskStorageDirectory()))
app.use(express.static(userTaskStorageDirectory()))
app.use(express.static(profileDirectory()))
app.use(express.static(transactionDirectory()))
app.use(express.static(ranksDirectory()))
app.use(express.static(proveDirectory()))
app.use(express.static(categoriesDirectory()))
app.use(express.static(socialDirectory()))
 

// ====== Root Route ======
// app.get('/', root);
app.get('/', root);

// ====== Products Route ======
app.use('/init', require("./routes/Init/index"));

// ====== Products Route ======
app.use('/product', require("./routes/product_routes/product_routes"));

// ====== Slider Provider Route ======
app.get('/slider_provider', slider_provider);
// ====== User Registation Route ======
app.post('/user', registation);
// ====== User Login Route ======
app.post("/logIn", login)
// ====== Read User Route ======
app.get("/user", authGard, read_user);
// ====== User Activation Route ======
app.post("/activation", authGard, user_activation);


// ====== User Update Route ======
app.patch("/user", authGard, update_user);
// ======User Password Reset Route ======
app.patch("/passwordReset", authGard, password_reset);
// ======Balance Transfer Route ======
app.post("/balance_transfer", authGard, balance_transfer);
// ======Balance Request Approval Route ======
app.post("/balance_request", authGard, balance_request);


// ======Mobile Recharge Route ======
app.post("/mobile_rechare", authGard, mobile_rechare);
// ======Withdraw Route ======
app.use("/withdraw", authGard, withdraw);
app.use("/admin-withdraw", adminAuthGard, adminWithdraw);


// ======Balance Transfer Route ======
app.use("/balance-transfer", authGard, balanceTransfer);
app.use("/admin-balance-transfer", adminAuthGard, adminBalanceTransfer);

// ======Withdraw Route ====== 
app.use("/public-prove",  publicProve);
app.use("/prove", authGard, prove);
app.use("/admin-prove", adminAuthGard, adminProve);

// ======Withdraw Route ======
app.use("/payments", authGard, payments);
app.use("/admin-payments", adminAuthGard, adminPayments);

// ======Generation User list Route ======
app.get("/generation", authGard, generation_list);

// ======All Generation User Route ======
app.get("/generation_user", authGard, generation_user);
// ======Admin User Details Read Route ======
app.get("/user/userDetails", authGard, user_dtails)


// ======Admin All User Read Route ======
app.get("/admin/users", adminAuthGard, all_user);
// ======Admin All User Read Route ======
app.get("/public/users", pubLicAllUser);
// ======Admin All User Read Route ======
app.get("/admin/user-count", adminAuthGard, userCount);
// ======Admin All User Read Route ======
app.get("/admin/balance-request", adminAuthGard, balanceRequest);
// ======Admin Balance Request List Route ======
app.get("/admin/balance-request-list", adminAuthGard, balanceRequestList);
// ======Admin User Update Read Route ======
app.post("/admin/update_user", adminAuthGard, admin_update_user);
// ======Admin Withdraw Request List Route ======
app.get("/admin/withdraw-request-list", adminAuthGard, withdrawRequestList);
// ======Admin Recharge Request List Route ======
app.get("/admin/recharge-request-list", adminAuthGard, rechargeRequestList);
// ======Admin Recharge Request Route ======
app.get("/admin/recharge-request", adminAuthGard, rechargeRequest);
// ======Admin Withdraw Request Route ======
app.get("/admin/withdraw-request", adminAuthGard, withdrawRequest);
// ======Admin Helpline Route ======
app.use("/admin/helpline-social", adminAuthGard, helpLineSocial);
// ======Admin Notification Route ======
app.use("/admin/notification", adminAuthGard, adminNotification);
// ======User Notification Route ======
app.use("/user/notification", authGard, notification);
// ======Admin Withdraw Request Route ======
app.use("/public/helpline-social", helpLineSocial);
// ======Admin Balance Requests Approval Route ======
app.post("/blanace_approval", adminAuthGard, balance_approval)



// ======Mobile Recharge Approval Route ======
app.post("/mobile_recharge_approval", adminAuthGard, mobile_recharge_approval);
// ======Withdraw Request Approval Route ======
app.post("/withdraw_request_approval", adminAuthGard, withdraw_request_approval)

// ======Mobile Recharge Decline Route  ======
app.post("/mobile_recharge_decline", adminAuthGard, mobile_recharge_decline)
// ======Balance Request Decline Route  ======
app.post("/balance_request_decline", adminAuthGard, balance_request_decline)
// ======Withdraw Request Decline Route  ======
app.post("/withdraw_request_decline", adminAuthGard, withdraw_request_decline)



// ======Slider Image Add Route  ======
app.post("/addSlider", adminAuthGard, add_slider_img)
// ======Slider Image Delete Route  ======
app.delete("/slider_img_delete", adminAuthGard, slider_img_delete)
// ======Notice Add Route  ======
app.post("/notice", adminAuthGard, add_notice)
// ======Notice Read Route  ======
app.get("/notice", read_notice)
// ====== Daily Task  ======
app.use("/daily-task", dailyTaskRoutes)
app.use("/profile", authGard, profileRoutes)
app.use("/admin-profile", adminAuthGard, adminProfileRoutes)

// ====== E-commerce Categories  ======
app.use("/categories",  userCategories)
app.use("/admin-categories", adminAuthGard, adminCategories)
// ====== Salary Categories  ======
app.use("/categories",  userCategories)
app.use("/admin-salary", adminAuthGard, adminSalary)
app.use("/salary", authGard, SalaryRoutes)

// ====== Tutorial Categories  ======
app.use("/tutorial", authGard, tutorial)
app.use("/admin-tutorial", adminAuthGard, adminTutorial)

// ====== Tutorial Categories  ======
app.use("/dashboard", dashboard)
app.use("/admin-dashboard", adminAuthGard, adminDashboard)

// ====== Tutorial Admin Config  ======
app.use("/admin-config", adminAuthGard, adminConfig);

// filter_delete_user()

// ====== Error Handling Middleware ======
app.use((error, req, res, next) => {
    if (error.message) {
        res.status(500).send({ error: error.message })
    } else if (error) {
        res.status(500).send({ error: "Something is wrong, please try out letter" })
    }
});

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})
