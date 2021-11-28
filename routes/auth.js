const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.route('/join')
.post(isNotLoggedIn, async (req, res, next) => {
    const { email, name, nick, password } = req.body;
    try {
        const findEmailUser = await User.findOne({ where: { email } });
        if (findEmailUser) {
            res.set('join-exist-error', true);
            return res.redirect('/');
        }
        const findNicklUser = await User.findOne({ where: { nick } });
        if (findNicklUser) {
            res.set('join-exist-error', true);
            return res.redirect('/');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            name,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});
// .get((req, res, next) => {
//     const { email, name, nick, password } = req.body;
//     if (req.query.error === 'exist') {
//         res.status(403).send(`${email}은 이미 존재하는 계정입니다.`);
//     }
//     next();
// });

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/home');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    return res.redirect('/');
});

module.exports = router;
