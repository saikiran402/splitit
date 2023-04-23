var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
const db = require('../models');
/* Create Group */
router.post('/create_group', middleware.protect, async function(req, res, next) {
console.log(req.body);
console.log(req.user)
var newGroup = await db.Group.create(req.body);
return res.status(200).json({ statusCode: 200, message: 'Group Created Succesfully',newGroup:newGroup })
//   GroupName: String,
//   GroupDescription: Number,
//   Created_on: { type: Date, default: Date.now() },
//   Discussion: [{ name: String, message: String, createdAt: Date }],
//   Expenses: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Expenses"
//   }],
//   Members: [{
//       userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Users"
//       },
//       joinedAt: Date
//   }],
//   ownerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Users"
//   },


});

/* Get My Group */
router.get('/get-groups', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Get Group by GroupId */
router.get('/get-groups/:groupId', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Delete Group */
router.delete('/get-groups/:groupId', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
  
/* Add participants to Group */
router.post('/add-participant/:groupId', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Remove participants to Group */
router.post('/remove-participant/:groupId', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



module.exports = router;
