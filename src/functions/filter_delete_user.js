const user_collection = require("../db/schemas/user_schema");

const filter_delete_user = async () => {
    try {
        console.log("hello from filter_delete_user")

        const AllUser = await user_collection.find()
        const activeUser = await AllUser.filter((user) => {
            return user.isActive
        })
        const admin = await AllUser.filter((user) => {
            return user.role == "admin"
        })
        const adminGenerationCount = await admin[0].generation_1.length + admin[0].generation_2.length + admin[0].generation_3.length + admin[0].generation_4.length + admin[0].generation_5.length + admin[0].generation_6.length + admin[0].generation_7.length + admin[0].generation_8.length + admin[0].generation_9.length + admin[0].generation_10.length

        const hello = await AllUser.map((user, index) => {
            if(user.role == "admin"){
                const perUser = user.generation_1.map( (gen) => {
                    const curUser = AllUser.filter( (userNow) => {
                        return userNow.phoneNumber === gen.toString()
                    })
                    console.log(curUser.length)
                    if((curUser.length < 1){
                        
                    }
                })
            }
            // return user.isActive
        })
        // console.log(hello)

        if (false && adminGenerationCount >= activeUser.length) {
            cons

        }




    } catch (error) {

    }

}

module.exports = filter_delete_user;