const express = require('express');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isLoggedIn, (req, res, next) => {
    res.render('msg', {
        title: 'Direct Messages',
    });
});

module.exports = router;
