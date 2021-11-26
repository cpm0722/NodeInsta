const express = require('express');
// const { User, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    // res.locals.user = req.user;
    // res.locals.followerCount = 0;
    // res.locals.followingCount = 0;
    // res.locals.FollowerIdList = [];
    next();
});

router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'SSUStagram',
    });
});

module.exports = router;
