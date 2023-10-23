import Joi from 'joi';

const register = Joi.object({
    name: Joi.string().max(100).min(2).required(),
    email: Joi.string().max(50).email().required(),
    password: Joi.string().min(6).required(),
});

const login = Joi.object({
    email: Joi.string().max(50).email().required(),

    password: Joi.string().min(6).required(),
});

export default {register, login};