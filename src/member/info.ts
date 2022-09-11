import { Request, Response, Router } from 'express';
import { DBError } from '../../server/app';

import { UserModel, UserObject } from '../../models/user';
import { userInfoRespond } from '../coms/respondClient';

const router = Router();

interface UserRequestObject {
  timezone: string;
  params: JSON;
  block: {
    id: string;
    name: string;
  };
  utterance: string;
  lang: null;
  user: {
    id: string;
    type: string;
    properties: JSON;
  };
}

interface UserActionObject {
  name: string;
  clientExtra: null;
  params: {
    studentID: string;
    passCode: string;
  };
  id: string;
  detailParams: JSON;
}

router.post('/', async (req: Request, res: Response) => {
  //# CHECK DB STATUS
  if (DBError !== null) return userInfoRespond(res, 500, null);

  console.log(req.body);

  //# AUTHORIZATION
  const authKey = process.env.LOGIN_BASIC_AUTH_KEY;
  if (authKey === undefined) return userInfoRespond(res, 500, null);
  if (req.headers.authorization !== `Basic ${authKey}`) return userInfoRespond(res, 403, null);

  //# GET USER OBJECT USING KAKAOTALK USER DATA
  const userRequest: UserRequestObject | undefined = req.body.userRequest,
    userAction: UserActionObject | undefined = req.body.action;
  if (userRequest === undefined || userAction === undefined) return userInfoRespond(res, 412, null);

  //# QUERY STUDENT INFORMATION
  const _user: UserObject | null = await UserModel.findOne({
    'auth.kakaoTalk': userRequest?.user.id,
  });
  if (_user === null) return userInfoRespond(res, 409, null);
  return userInfoRespond(res, 200, _user);
});
export default router;
