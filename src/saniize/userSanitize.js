const user_collection = require("../db/schemas/user_schema");

const userSanitize = async () => {
  console.log("hello form senitizing func");
  try {
    const allUser = await user_collection
      .find()
      .select("firstName lastName referNumber phoneNumber");

    console.log("length ==>>", allUser.length);
    await Promise.all(
      allUser.map(async (userInfo) => {
        try {
          const user = userInfo._doc;
          if (!user.referNumber) {
            return;
          }

          const referUser = await user_collection
            .findOne({
              phoneNumber: user.referNumber,
            })
            .select("_id,");
          if (referUser) {
            const updateUser = await user_collection
              .findOneAndUpdate(
                { _id: user._id },
                { referUser: referUser._id },
                { new: true }
              )
              .select("_id referUser");

            console.log("updateUser ==>>", updateUser);
          }
        } catch (error) {
          console.log("Error:-", error);
        }
      })
    );
    console.log("Senitize completed");
  } catch (error) {
    console.log("Error: -", error);
  }
};

// userSanitize();
