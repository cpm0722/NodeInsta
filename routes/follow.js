const express = require('express');
const { User, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { getTotalUsers } = require('../utils');

const router = express.Router();

router.use(async (req, res, next) => {
  res.locals.user = req.user;
  if (res.locals.user) {
    const user = await User.findOne({ where: { 'id': req.user.id } });
    res.locals.followers = await user.getFollowers();
    res.locals.followings = await user.getFollowings();
  }
  next();
});

router.post('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } })
    console.log(req.user);
    console.log(user);
    if (user) {
      let followings = await res.locals.followings.map(item => item['dataValues']['id']);
      if (followings.findIndex(id => id == req.params.id) == -1) { // Follow
        await req.user.addFollowing(parseInt(req.params.id, 10));
      }
      else if (req.user.id == req.params.id) {
        res.status(404).send('same user');
      }
      else { // Unfollow
        req.user.removeFollowing(req.params.id);
      }
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/', isLoggedIn, async (req, res, next) => {
  res.locals.users = await getTotalUsers(req.user);
  console.log(res.locals.users);
  res.render('follow', {
    title: 'Followings',
  });
});

module.exports = router;
