const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../models/User');

module.exports = {
    register: (req, res) => {
        const {errors, isValid} = validateRegisterInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        };
        User.findOne({email:req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json({message: 'User already exists'});
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            };
        });
    },
    login: (req, res) => {
        const {errors, isValid} = validateLoginInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        };
        const {email, password} = req.body;
        User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json({message: 'Email or password incorrect'});
            };
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch){
                    const payload = {
                        id: user._id,
                        name: user.name
                    };
                    jwt.sign(
                        payload,
                        {expiresIn: 31556926},
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer' + token
                            });
                        }
                    );
                } else {
                    return res.status(400).json({message: 'Email or password incorrect'});
                };
            });
        });
    },
    logout: (req, res) => {

    }
}