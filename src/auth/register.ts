import { Request, Response, Router } from 'express';
import { DBError } from '../../server/app';
import { UserModel } from '../../models/user';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  //# CHECK DB STATUS
  if (DBError !== null) return res.status(500).end('ERROR');

  //# AUTHORIZATION
  const authKey = process.env.LOGIN_BASIC_AUTH_KEY;

  if (authKey === undefined) return res.status(403).end('NOT AUTHORIZED');
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  if (req.headers.authorization !== `Basic ${authKey}`) return res.status(403).end('NOT AUTHORIZED');

  //# SAVE USER ACCOUNT ON DATABASE
  const createUser = new UserModel({
    info: {
      name: req.body.name,
      depart: req.body.depart,
      age: req.body.age,
      phone: `0${req.body.phone}`,
      dues: `${req.body.dues === 'O'}`,
    },
    auth: {
      type: req.body.type,
      studentID: req.body.id,
      passCode: req.body.phone.toString().substring(6, 10),
    },
    game: {
      league: {
        win: {
          count: 0,
          data: [],
        },
        lose: {
          count: 0,
          data: [],
        },
        draw: {
          count: 0,
          data: [],
        },
      },
      ranking: {
        win: {
          count: 0,
          data: [],
        },
        lose: {
          count: 0,
          data: [],
        },
        draw: {
          count: 0,
          data: [],
        },
      },
      custom: {
        win: {
          count: 0,
          data: [],
        },
        lose: {
          count: 0,
          data: [],
        },
        draw: {
          count: 0,
          data: [],
        },
      },
    },
  });

  //# SAVE USER ACCOUNT INTO DATABASE
  const userSaveResult = await createUser.save();
  if (!userSaveResult) return res.status(500).end('ERROR');
  res.status(200).end('SUCCESS');
  console.log(`REGISTER SUCCESS ${req.body.name}`);
});
export default router;
