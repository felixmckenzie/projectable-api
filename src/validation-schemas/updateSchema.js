import Joi from 'joi';

const updateSchema = Joi.object({
  email: Joi.string().email(),
  displayName: Joi.string().min(3).max(30),
  password: Joi.string().min(8),
  confirmPassword: Joi.ref('password'),
});

export default updateSchema;
