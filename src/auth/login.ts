import { Request, Response, Router } from 'express';
import { DBError } from '../../server/app';
import { loginRespond } from '../coms/respondClient';

import { UserModel, UserObject } from '../../models/user';

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
  if (DBError !== null) return loginRespond(res, 500, null);

  //# AUTHORIZATION
  const authKey = process.env.LOGIN_BASIC_AUTH_KEY;
  if (authKey === undefined) return loginRespond(res, 500, null);
  if (req.headers.authorization !== `Basic ${authKey}`) return loginRespond(res, 403, null);
  //# GET USER OBJECT USING STUDENT CODE & PASSWORD(LAST PHONE 4 DIGITS)
  const userRequest: UserRequestObject | undefined = req.body.userRequest,
    userAction: UserActionObject | undefined = req.body.action;
  if (userRequest === undefined || userAction === undefined) return loginRespond(res, 412, null);

  //# QUERY STUDENT INFORMATION
  if (Number.isNaN(Number(userAction.params.studentID))) return loginRespond(res, 412, null);
  const _user: UserObject | null = await UserModel.findOne({
    'auth.studentID': Number(userAction.params.studentID),
  });
  if (_user === null) return loginRespond(res, 410, null);
  if (_user.auth.passCode.toString() !== userAction.params.passCode) return loginRespond(res, 409, null);

  await UserModel.updateMany({ 'auth.kakaoTalk': userRequest.user.id }, { 'auth.kakaoTalk': undefined });
  const _result = await UserModel.updateOne(
    { 'auth.studentID': userAction.params.studentID, 'auth.passCode': userAction.params.passCode },
    { 'auth.kakaoTalk': userRequest.user.id },
  );
  if (!_result) return loginRespond(res, 501, null);
  return loginRespond(res, 200, _user);
});
export default router;
