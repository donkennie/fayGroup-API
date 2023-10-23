import Joi from 'joi';

const blog = Joi.object({
    userId: Joi.string().required(),
    content: Joi.string().required(),
    title: Joi.string().required(),
});

export default {blog};