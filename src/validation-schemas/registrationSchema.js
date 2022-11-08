import Joi from 'joi';

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref('password'),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export default registrationSchema; 