const mongoose = require('mongoose');
const Joi = require('joi');

const emailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    template_content: {
        type: String,
        required: true
    },
});

const Email = mongoose.model('Email', emailSchema);

const validateEmail = (email) => {
    const schema = {
        name: Joi.string().required(),
        template_content: Joi.string().required(),
    }

    return Joi.validate(email, schema);
}


module.exports.Email = Email;
module.exports.validate = validateEmail;