const Validator = require('validator');
const isEmpty = require('is-empty');

const validateRegisterInput = (data) => {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    if(Validator.isEmpty(data.name)){
        errors.name = 'Name field is required';
    };
    if(Validator.isEmpty(data.email)){
        errors.email = 'Email field is required';
    } else if (!Validator.isEmail(data.email)){
        errors.email = 'Email is not valid';
    };
    if(Validator.isEmpty(data.password)){
        errors.password = 'Password field is required';
    };
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = validateRegisterInput; 