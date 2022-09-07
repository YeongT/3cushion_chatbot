import { Response as Res } from 'express';
import { UserObject } from '../../models/user';

const loginRespond = (res: Res, returnCode: number, user: UserObject | null): void => {
  let TEXT = 'ERROR';

  switch (returnCode) {
    case 200:
      TEXT = `${user?.info.name || '사용자'}님 환영합니다. 카카오톡 연동에 성공하였습니다`;
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

  const result: {
    template: { outputs: { simpleText: { text: string } }[]; quickReplies: any[] };
    version: string;
  } = {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: TEXT,
          },
        },
      ],
      quickReplies: [],
    },
  };
  if (returnCode !== 200 && user !== null) {
    if (!user.info.dues) {
      result.template.outputs.push({
        simpleText: {
          text: '현재 데이터베이스 기준 회비 미납 상태입니다. 회비 납부 후 총무에게 문의주세요.',
        },
      });
    }
    result.template.quickReplies.push({ label: '로그인 다시시도', action: 'message', messageText: '로그인' });
  }
  if (returnCode === 200)
    result.template.quickReplies.push({
      label: '동아리방 정보',
      action: 'message',
      messageText: '동아리방 정보',
    });
  res.status(200).json(result);
};

const clubRoomRespond = (res: Res, returnCode: number, user: UserObject | null): void => {
  let TEXT = 'ERROR';

  switch (returnCode) {
    case 200:
      TEXT = `${
        user?.info.name || '사용자'
      }님 안녕하세요. 쓰리쿠션 동아리방은 107관 507호에 위치하고 있습니다. 동아리방 비밀번호는 '${
        process.env.CLUBROOM_PASSCODE || '현재 비공개 상태'
      }' 입니다.`;
      break;
    case 409:
      TEXT = '로그인 하지 않았거나 등록되지 않은 동아리원 입니다.';
      break;
    case 403:
      TEXT = '권한오류입니다. 관리자에게 문의주세요';
      break;
    default:
      TEXT = '알수없는 오류가 발생했습니다. 관리자에게 문의주세요';
      break;
  }

  const result: {
    template: { outputs: { simpleText: { text: string } }[]; quickReplies: any[] };
    version: string;
  } = {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: TEXT,
          },
        },
      ],
      quickReplies: [],
    },
  };
  if (returnCode === 409) {
    result.template.quickReplies.push({ label: '로그인 하기', action: 'message', messageText: '로그인' });
  }
  res.status(200).json(result);
};
export { loginRespond, clubRoomRespond };
