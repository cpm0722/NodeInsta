const express = require('express');
const { User, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res, next) => {
  res.render('main', {
    title: 'SSUStagram',
  });
});

module.exports = router;
