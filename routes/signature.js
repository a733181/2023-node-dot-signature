import { Router } from 'express';
import content from '../middleware/content.js';
import { jwt } from '../middleware/auth.js';

import { create, query, del } from '../controllers/signature.js';

const router = Router();

router.post('/create', content('application/json'), jwt, create);
router.post('/get', content('application/json'), jwt, query);
router.post('/del', content('application/json'), jwt, del);

export default router;
