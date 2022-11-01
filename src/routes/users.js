import { Router } from 'express';
import { registerUser, loginUser } from './usersHelpers.js';
import schemaValidator from '../middleware/schemaValidator.js';
import registrationSchema from '../validation-schemas/registrationSchema.js';
import loginSchema from '../validation-schemas/loginSchema.js';

const usersRouter = Router();

usersRouter.post(
  '/register',
  schemaValidator(registrationSchema),
  async (req, res) => {
    // Register the user:
    const registrationOutcome = await registerUser(
      req.body.email,
      req.body.password
    );

    if (registrationOutcome.error) {
      console.log(registrationOutcome);
      return res.json({ error: registrationOutcome.error });
    }

    // Initialise the user's profile:
    const { username } = req.body;

    // const initProfileOutcome = await initUserProfile(registrationOutcome, {
    //   username,
    // });

    // if (initProfileOutcome.error) {
    //   return res.json({ error: initProfileOutcome.error });
    // }

    // Log the user in:
    const { email, password } = req.body;

    const loginOutcome = await loginUser(email, password);

    if (loginOutcome.error) {
      return res.json({ error: loginOutcome.error });
    }

    res.json(loginOutcome);
  }
);

usersRouter.post('/login', schemaValidator(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const loginOutcome = await loginUser(email, password);

  if (loginOutcome.error) {
    return res.json({ error: loginOutcome.error });
  }

  res.json(loginOutcome);
});

export default usersRouter;
