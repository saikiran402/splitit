var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
const db = require('../models');
/* Create Group */
router.post('/create_group', middleware.protect, async function(req, res, next) {
console.log(req.body);
console.log(req.user)
req.body.ownerId = req.user._id;
var newGroup = await db.Group.create(req.body);
return res.status(200).json({ statusCode: 200, message: 'Group Created Succesfully',newGroup:newGroup })
});

/* Get My Group */
router.get('/get-groups',middleware.protect, async function(req, res, next) {
    var myGroups = await db.Group.find({ownerId:req.user._id})
    return res.status(200).json({ statusCode: 200, message: 'My Groups',myGroups:myGroups })
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
