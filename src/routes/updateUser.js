import { Router } from 'express';
import { getUserById, updateUserDetails, deleteUser } from '../controllers/usersHelpers.js';
import updateSchema from '../validation-schemas/updateSchema.js';
import schemaValidator from '../middleware/schemaValidator.js';
const updateUserRouter = Router()


updateUserRouter.get('/',getUserById)

updateUserRouter.put('/update', schemaValidator(updateSchema) ,updateUserDetails)

updateUserRouter.delete('/delete', deleteUser )

export default updateUserRouter 