

const {body} = require('express-validator/check');

exports.registerValidators = [
    body('email').isEmail().withMessage('Введите коректный email')
]

module.exports =