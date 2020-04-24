const User = require('../models/User');
const { validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');


module.exports = {
    //register new user
    register: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ error: errors.array() });
        }
        const { name, email, password } = req.body;
        User.findOne({ email }).then(user => {
            if (user) {
                return res.json({message:'User exists'});
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
                            res.json(user);
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

    //render profile page
    profilePage: (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.render('auth/profile');
        } else {
            return res.redirect('/fail');
        }
    },

    //render update profile page
    updateProfilePage: (req, res) => {
        if (req.isAuthenticated()) {
            return res.render('auth/updateProfile');
        }
        return res.redirect('/fail');
    },
    
    //update profile
    updateProfile: (params, id) => {
        const {
            name,
            email,
            address,
            oldPassword,
            newPassword,
            repeatNewPassword
        } = params;
        return new Promise((resolve, reject) => {
            User.findById(id)
            .then(user => {
                if (name) user.profile.name = name;
                if (email) user.email = email;
                if (address) user.address = address;
                return user;
            })
            .then(user => {
                user.save().then(user => {
                resolve(user);
                });
            })
            .catch(err => reject(err));
        }).catch(err => reject(err));
    },
    
    //update password
    updatePassword: (params, id) => {
        return new Promise((resolve, reject) => {
            User.findById(id)
            .then(user => {
                if (
                !params.oldPassword ||
                !params.newPassword ||
                !params.repeatNewPassword
                ) {
                    reject('All password inputs must be filled');
                } else if (params.newPassword !== params.repeatNewPassword) {
                    reject('New passwords do not match');
                } else {
                    bcrypt
                    .compare(params.oldPassword, user.password)
                    .then(result => {
                        if (result === false) {
                            reject('Old Password Incorrect');
                        } else {
                            user.password = params.newPassword;
                            user
                            .save()
                            .then(user => {
                                resolve(user);
                            })
                            .catch(err => {
                                throw new Error(err);
                            });
                        }
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
                }
            })
            .catch(err => {
                reject(err);
            });
        });
    },

    //render login page
    loginPage:(req, res) => {
        return res.render('users/login', { errors: req.flash('errors') });
    },

    //login user
    // login: passport.authenticate('local-login', 
    // (req, res) => {
    //     console.log(req.user);
        // return res.json(req.user)
    // }),
    // {
    //     successRedirect: '/auth/options',
    //     failureRedirect: '/api/users/loginError',
    //     failureFlash: true
    // }

    login: (req, res) => {
        User.findOne({email:req.body.email})
        .then((user) => {
            bcrypt.compare(req.body.password, user.password)
            .then(result => {
                if(!result){
                    //no error no user
                    return res.status(500).json(
                        {message:'Check email or password!'}
                        );
                } else {
                    return res.status(200).json(user);
                }
            })
        })
    },

    //render login error page
    loginError: (req, res) => {
        res.render('auth/error', {error: 'Please check that you are registered and are using the correct email address and password.'})
    },

    //logout user, end session
    logout:(req, res) => {
        req.session.destroy();
        console.log('logout ', req.session);
        req.logout();
        return res.json({message:'Logged out'});
    }
}