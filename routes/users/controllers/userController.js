const User = require('../models/User');
const { validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

module.exports = {
    //register new user
    register: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('auth/error', { error: errors.array() });
        }
        const { name, email, password } = req.body;
        User.findOne({ email }).then(user => {
            if (user) {
                return res.json({error:'User exists'});
            } else {
                const newUser = new User();
                newUser.name = name;
                newUser.email = email;
                newUser.password = password;
                newUser
                .save()
                .then(user => {
                    req.login(user, err => {
                        if (err) {
                            return res
                            .status(400)
                            .json({ confirmation: false, message: err });
                        } else {
                            res.redirect('/auth/options');
                        }
                    });
                })
                .catch(err => {
                    return next(err);
                });
            }
        })
        .catch(err => reject(err));
    },
    
    //login user
    login: passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/api/users/loginError',
        failureFlash: true
    }),
    
    //logout user, end session
    logout:(req, res) => {
        req.session.destroy();
        console.log('logout ', req.session);
        req.logout();
        return res.redirect('/');
    }
}