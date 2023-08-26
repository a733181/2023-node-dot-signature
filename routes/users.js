import { Router } from 'express';
import content from '../middleware/content.js';
import { jwt, login as authLogin } from '../middleware/auth.js';

import {
  register,
  login,
  logout,
  extend,
  editUser,
} from '../controllers/users.js';

const router = Router();

router.post('/register', content('application/json'), register);
router.post('/login', content('application/json'), authLogin, login);
router.post('/logout', jwt, logout);
router.post('/extend', jwt, extend);
router.post('/editUser', content('application/json'), jwt, editUser);

export default router;
