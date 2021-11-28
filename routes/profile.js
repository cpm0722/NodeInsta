const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.use(async (req, res, next) => {
    res.locals.user = req.user;
    if (res.locals.user) {
        const user = await User.findOne({ where: { 'email': res.locals.user.email } });
        res.locals.followers = await user.getFollowers();
        res.locals.followings = await user.getFollowings();
        res.locals.followerCount = res.locals.followers.length;
        res.locals.followingCount = res.locals.followings.length;
    }
    next();
});

router.get('/', isLoggedIn, (req, res, next) => {
    res.render('profile', {
        title: 'SSUStagram profile',
    });
});

module.exports = router;
