var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
const db = require('../models');
/* Create Group */
router.post('/create_group', middleware.protect, async function (req, res, next) {
    console.log(req.body);
    console.log(req.user)
    req.body.ownerId = req.user._id;
    var newGroup = await db.Group.create(req.body);
    return res.status(200).json({ statusCode: 200, message: 'Group Created Succesfully', newGroup: newGroup })
});

/* Get My Group */
router.get('/get-groups', middleware.protect, async function (req, res, next) {
    var myGroups = await db.Group.find({ ownerId: req.user._id })
    return res.status(200).json({ statusCode: 200, message: 'My Groups', myGroups: myGroups })
});

/* Get Group by GroupId */
router.get('/get-group/:groupId', async function (req, res, next) {
    var groupData = await db.Group.findOne({ _id: req.params.groupId }).populate('ownerId', 'name')
    if (groupData) {
        return res.status(200).json({ statusCode: 200, message: 'Group Data', groupData: groupData })

    } else {
        return res.status(409).json({ statusCode: 409, message: 'No Such group exists' })
    }
});

/* Delete Group */
router.delete('/get-group/:groupId', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Add participants to Group */
router.post('/add-participant/:groupId', middleware.protect, async function (req, res, next) {
    var groupData = await db.Group.findOne({ _id: req.params.groupId });
    if (groupData.ownerId == req.user._id) {
        if (groupData) {
            var participants = []
            req.body.participants.forEach(async (list) => {
                var userData = await db.User.findOne({ _id: list.phone })
                if (userData) {
                    participants.push({
                        userId: userData._id,
                        joinedAt: Date.now()
                    })
                }
            })
            groupData.Members = participants;
            groupData.save()
            return res.status(200).json({ statusCode: 200, message: 'Added Participant to ' + groupData.name, groupData: groupData })
        } else {
            return res.status(409).json({ statusCode: 409, message: 'No Such group exists' })
        }
    } else {
        return res.status(409).json({ statusCode: 409, message: 'You are not authorised to perform this action' })
    }
});

/* Remove participants to Group */
router.post('/remove-participant/:groupId', function (req, res, next) {
    res.render('index', { title: 'Express' });
});



module.exports = router;
