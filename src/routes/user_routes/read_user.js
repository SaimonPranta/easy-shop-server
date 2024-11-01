const Generations = require("../../db/schemas/generations");
const user_collection = require("../../db/schemas/user_schema");

const read_user = async (req, res) => {
  try {
    const phoneNumber = req.phoneNumber.toString();
    const userId = req.id;
    let user = await user_collection
      .findOne({ _id: userId, phoneNumber: phoneNumber })
      .populate([{
        path: "rankID", 
      }, {
        path: "referUser",
        select: "firstName lastName phoneNumber",
      }]);
    user.password = null;
    if (user) {
      const date = new Date();
      date.setDate(date.getDate() - 16);

      const recentReferList = await Generations.countDocuments({
        referByUser: user._id,
        generationNumber: 1,
        createdAt: { $gt: date },
      });

      user = {
        ...user._doc,
        availableForTask: recentReferList >= 4 ? true : false,
      };
      console.log("user ==>>", user);
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(200).json({});
  }
};

module.exports = read_user;
