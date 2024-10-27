const Generations = require("../db/schemas/generations");
const user_collection = require("../db/schemas/user_schema");

const userSanitize = async () => {
  console.log("hello form senitizing func");
  try {
    const allUser = await user_collection
      .find()
      .select(
        "firstName lastName referNumber phoneNumber generation_1 generation_2 generation_3 generation_4 generation_5 generation_6 generation_7 generation_8 generation_9 generation_10"
      );

    console.log("length ==>>", allUser.length);
    await Promise.all(
      allUser.map(async (userInfo) => {
        try {
          console.log("Enter Map")
          const user = await userInfo._doc;
          const generation_1 = user.generation_1
          if (generation_1 && generation_1.length) {
            await Promise.all(
              generation_1.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 1,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }
          console.log("Gen 1 End")


          const generation_2 = user.generation_2
          if (generation_2 && generation_2.length) {
            await Promise.all(
              generation_2.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 2,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }

          console.log("Gen 2 End")

          const generation_3 = user.generation_3
          if (generation_3 && generation_3.length) {
            await Promise.all(
              generation_3.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 3,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }
          console.log("Gen 3 End")


          const generation_4 = user.generation_4
          if (generation_4 && generation_4.length) {
            await Promise.all(
              generation_4.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 4,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }

          console.log("Gen 4 End")

          const generation_5 = user.generation_5
          if (generation_5 && generation_5.length) {
            await Promise.all(
              generation_5.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 5,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }
          console.log("Gen 5 End")


          const generation_6 = user.generation_6
          if (generation_6 && generation_6.length) {
            await Promise.all(
              generation_6.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 6,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }
          console.log("Gen 6 End")


          const generation_7 = user.generation_7
          if (generation_7 && generation_7.length) {
            await Promise.all(
              generation_7.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 7,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }
          console.log("Gen 7 End")


          const generation_8 = user.generation_8
          if (generation_8 && generation_8.length) {
            await Promise.all(
              generation_8.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 8,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }

          console.log("Gen 8 End")

          const generation_9 = user.generation_9
          if (generation_9 && generation_9.length) {
            await Promise.all(
              generation_9.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 9,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
          }

          console.log("Gen 9 End")

          const generation_10 = user.generation_10
          if (generation_10 && generation_10.length) {
            await Promise.all(
              generation_10.map(async (phoneNumber) => {
                try {
                  const refUser = await user_collection
                    .findOne({ phoneNumber: phoneNumber })
                    .select("_id");
                  if (refUser) {
                    await Generations.create({
                      referByUser: user._id,
                      generationNumber: 10,
                      referredUser: refUser._id,
                    });
                  }
                } catch (error) {
                  console.log("error", error);
                }
              })
            );
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

userSanitize();
