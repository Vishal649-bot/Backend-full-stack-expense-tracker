const User = require("../modals/user");
const Expense = require("../modals/expense");
const sequelize= require("sequelize");

exports.showLeaderBoard = async (req, res) => {
  try {
    // Find all expenses with corresponding user IDs
    const expenses = await Expense.findAll();
    // console.log('expense',expenses);
    // Find all users
    const users = await User.findAll();
    // console.log('user',users);

    let outputArr=[]
    users.forEach(user=>{
      // console.log('jhapa',user.dataValues.id);
      const id = user.dataValues.id;
      let totalSpent = 0
      expenses.forEach(expense=>{
        // console.log("jhapa",expense.dataValues.userSignupId);
        const expenseid = expense.dataValues.userSignupId
        // console.log(expenseid);
        if(id === expenseid){
          totalSpent = totalSpent + parseInt(expense.dataValues.expense,10)
        }
      })

      // console.log("--------------------")
      // console.log(totalSpent)
      // console.log(user.dataValues.name)
      // console.log("--------------------")
      outputArr.push({
        name: user.dataValues.name,
        totalSpent: totalSpent ,
      })

    })
    console.log("outputArr" , outputArr)
    

    res.json({ success: true, outputArr });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
};


exports.checkPremium = async (req, res) => {
  try {
    const result = await req.user.isPremiumUser;
    return res.json(result);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};




