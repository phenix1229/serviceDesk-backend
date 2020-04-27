const User = require('../models/User');
const { validationResult } = require('express-validator');
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

    login: (req, res) => {
        User.findOne({email:req.body.email})
        .then((user) => {
            if(!user){
                return res.status(500).json({message:'No user found'})
            };
            bcrypt.compare(req.body.password, user.password)
            .then(result => {
                console.log(result)
                if(!result){
                    //no error no user
                    return res.status(500).json(
                        {message:'Check email or password!'}
                        );
                } else {
                    return res.status(200).json(user);
                };
            })
        })
        .catch(err => {
            res.status(500).json({error:'server error'});
        });
    },

    //logout user, end session
    logout:(req, res) => {
        req.session.destroy();
        console.log('logout ', req.session);
        req.logout();
        return res.json({message:'Logged out'});
    }
}