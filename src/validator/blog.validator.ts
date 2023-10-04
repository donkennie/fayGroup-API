import Joi from 'joi';

const blog = Joi.object({
    content: Joi.string().required(),
    title: Joi.string().required(),
    blogPictureUrl: Joi.string().required()
});

export default {blog};