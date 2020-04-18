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
    login,
    logout
}