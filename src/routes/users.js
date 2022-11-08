import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/usersHelpers.js';
import schemaValidator from '../middleware/schemaValidator.js';
import registrationSchema from '../validation-schemas/registrationSchema.js';
import loginSchema from '../validation-schemas/loginSchema.js';

const usersRouter = Router();

usersRouter.post(
  '/register',
  schemaValidator(registrationSchema),
  async (req, res) => {
    // Register the user:
    const newUserDetails = {
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.username,
    };
    const registrationOutcome = await registerUser(newUserDetails);

    if (registrationOutcome.error) {
      console.log(registrationOutcome);
      return res.json({ error: registrationOutcome.error });
    }

    // Log the user in:
    // const loginOutcome = await loginUser(newUserDetails);

    // if (loginOutcome.error) {
    //   return res.json({ error: loginOutcome.error });
    // }

    res.json(registrationOutcome);
  }
);

usersRouter.post('/login', schemaValidator(loginSchema), async (req, res) => {
  const userDetails = req.body;

  const loginOutcome = await loginUser(userDetails);

  if (loginOutcome.error) {
    return res.json({ error: loginOutcome.error });
  }

  res.json(loginOutcome);
});

export default usersRouter;
