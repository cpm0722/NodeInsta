const express = require('express');
const { User, Post, Image, Hashtag } = require('../models');
const { db } = require('../models/index');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { getPostsFromQuery } = require('../utils');

const router = express.Router();

router.use(async (req, res, next) => {
  res.locals.posts = await getPostsFromQuery(req.query);
  next();
});

router.get('/', isLoggedIn, (req, res, next) => {
  res.render('home', {
    title: 'SSUStagram',
  });
});

module.exports = router;
