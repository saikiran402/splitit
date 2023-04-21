const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect("mongodb+srv://saikiranp1199:reset123@cluster0.kqp8wsc.mongodb.net/?retryWrites=true&w=majority", {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((resp)=>{
    console.log('DB Connection success')
});


module.exports.User = require("./users");
module.exports.Activity = require("./activity");
module.exports.Expenses = require("./expenses");
module.exports.Group = require("./groups");
module.exports.Notifications = require("./notifications");