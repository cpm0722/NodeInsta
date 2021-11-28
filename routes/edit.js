const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User, Post, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('edit', {
    title: 'edit post',
  });
});

module.exports = router;
