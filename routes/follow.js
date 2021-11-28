const express = require('express');
const { User, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

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
    res.render('follow', {
        title: 'Followings',
    });
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
//     try {
//         const user = await User.findOne({ where: { id: req.user.id } });
//         if (user) {
//             await user.addFollowing(parseInt(req.params.id, 10));
//             res.send('success');
//         } else {
//             res.status(404).send('no user');
//         }
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// });

module.exports = router;
