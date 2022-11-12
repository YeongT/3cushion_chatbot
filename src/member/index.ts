import { Router } from 'express';
import memberInfo from './info';

const router = Router();

router.use('/info', memberInfo);

export default router;
