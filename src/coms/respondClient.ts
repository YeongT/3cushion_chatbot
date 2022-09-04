import { Response as Res } from 'express';

const loginRespond = (res: Res, returnCode: number, user: string | null): void => {
  let TEXT = 'ERROR';

  switch (returnCode) {
    case 200:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      TEXT = `${user}님 환영합니다. 카카오톡 연동에 성공하였습니다`;
      break;
    case 410:
      TEXT = '등록되지 않은 동아리원입니다. 관리자에게 문의주세요.';
      break;
    case 409:
      TEXT = '인증에 실패하였습니다. 다시시도해주세요.';
      break;
    case 403:
      TEXT = '권한오류입니다. 관리자에게 문의주세요';
      break;
    case 501:
      TEXT = '카카오톡 연동에 실패했습니다.관리자에게 문의주세요.';
      break;
    default:
      TEXT = '알수없는 오류가 발생했습니다. 관리자에게 문의주세요';
      break;
  }

  res.status(200).json({
    version: '2.0',
    data: {
      result: TEXT,
    },
  });
};

export { loginRespond };
