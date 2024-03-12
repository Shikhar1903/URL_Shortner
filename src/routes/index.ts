import { Router } from 'express';
import { redirect, shortenUrl } from '../controllers/index.controllers';

const router = Router();

router.post('/shorten', shortenUrl);
router.get('/redirect/:code', redirect);

export default router;