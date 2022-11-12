import { Router } from 'express';
import age from './age';
import phone from './phone';
import passCode from './passCode';
import studentID from './studentID';

const router = Router();

router.use('/age', age);
router.use('/phone', phone);
router.use('/passcode', passCode);
router.use('/studentId', studentID);
export default router;
