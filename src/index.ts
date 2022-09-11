import { Request, Response, Router } from 'express';
import { DBError } from '../server/app';
import loginAPI from './auth/login';
import registerAPI from './auth/register';
import clubRoomAPI from './info/clubroom';
import memberInfoAPI from './member/info';

import validStudentIDAPI from './validator/studentID';
import validPassCodeAPI from './validator/passCode';
import validPhoneNumAPI from './validator/phone';
import validAgeAPI from './validator/age';

const router = Router();

interface statusCheck {
  name: string;
  error: string | null;
}

router.get('/', (req: Request, res: Response) => {
  const DB_STATUS =
    DBError === null ? `<a class="statusOkay">Connected</a>` : `<a class="statusError">${DBError}</a> `;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<title>CAU-3cushion-Chat bot API Server</title>');
  res.write('<link rel="icon" href="https://api.loadover.me/src/icon.png">');
  res.write('<link rel="stylesheet" href="https://api.loadover.me/src/styles/apiMain.css">');
  res.write('Welcome!<br>This is API Server of 3Cushion-Chat bot<br><br>');
  res.end(`Database Connection : ${DB_STATUS}`);
});

router.get('/status', (req: Request, res: Response) => {
  // eslint-disable-next-line prefer-const
  let errors: Array<statusCheck> = new Array<statusCheck>(),
    errorCount = 0;
  errors.push({ name: 'Database-Connection', error: DBError });
  errors.push({
    name: 'Login-Basic-Auth-Key',
    error: process.env.LOGIN_BASIC_AUTH_KEY ? null : 'MISSING_BASIC_AUTH_KEY',
  });
  errors.forEach((errorObject) => {
    if (errorObject.error !== null) errorCount++;
  });
  res.status(errorCount === 0 ? 200 : 500).json(errors);
});

router.use('/auth/login', loginAPI);
router.use('/auth/register', registerAPI);
router.use('/info/clubroom', clubRoomAPI);
router.use('/member/info', memberInfoAPI);

router.use('/validator/passcode', validPassCodeAPI);
router.use('/validator/studentId', validStudentIDAPI);
router.use('/validator/phonenum', validPhoneNumAPI);
router.use('/validator/age', validAgeAPI);
export default router;
