import { Response, Response as Res } from 'express';
import { UserObject } from '../../models/user';

interface linkObject {
  pc?: string;
  mobile?: string;
  web?: string;
}
interface buttonObject {
  label: string;
  action: 'webLink' | 'message' | 'block' | 'phone';
  webLinkUrl?: string;
  messageText?: string;
  phoneNumber?: string;
  blockId?: string;
  extra?: Map<string, any>;
}
interface quickReplyObject {
  label: string;
  action: string;
  messageText: string;
}
interface simpleTextObject {
  simpleText: {
    text: string;
  };
}
interface listItemObject {
  title: string;
  description?: string;
  imageUrl?: string;
  action?: 'message' | 'block';
  blockId?: string;
  messageText?: string;
  extra?: Map<string, any>;
}
interface listCardObject {
  header: listItemObject;
  items: listItemObject[];
  buttons?: buttonObject[];
}
interface thumbnailObject {
  imageUrl: string;
  link?: linkObject;
  fixedRatio?: boolean;
  width?: number;
  height?: number;
}
interface carouselHeaderObject {
  title: string;
  description: string;
  thumbnail: thumbnailObject;
}
interface carouselObject {
  carousel: {
    type: 'basicCard' | 'commerceCard' | 'listCard' | 'itemCard';
    items: listCardObject[]; //max 5 item
    header?: carouselHeaderObject;
  };
}

const loginRespond = (res: Res, returnCode: number, user: UserObject | null): void => {
  let TEXT = 'ERROR';

  switch (returnCode) {
    case 200:
      TEXT = `${user?.info.name || '사용자'}님 환영합니다. 카카오톡 연동에 성공하였습니다`;
      break;
    case 409:
      TEXT = '등록되지 않은 동아리원입니다. 관리자에게 문의주세요.';
      break;
    case 410:
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

  // eslint-disable-next-line prefer-const
  let result: {
    template: { outputs: simpleTextObject[]; quickReplies: quickReplyObject[] };
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
  if (returnCode === 200 && user !== null) {
    if (!user.info.dues) {
      result.template.outputs.push({
        simpleText: {
          text: '현재 데이터베이스 기준 회비 미납 상태입니다. 회비 납부 후 총무에게 문의주세요.',
        },
      });
    }
    result.template.quickReplies.push({
      label: '동아리방 정보',
      action: 'message',
      messageText: '동아리방 정보',
    });
  } else
    result.template.quickReplies.push({ label: '로그인 다시시도', action: 'message', messageText: '로그인' });

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

  // eslint-disable-next-line prefer-const
  let result: {
    template: { outputs: simpleTextObject[]; quickReplies: quickReplyObject[] };
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

const userInfoRespond = (res: Res, returnCode: number, user: UserObject | null) => {
  let TEXT = 'ERROR';

  switch (returnCode) {
    case 200:
      TEXT = `현재 데이터베이스에 등록된 ${user?.info.name}님의 회원정보 입니다. 확인 후 변경을 원하시는 정보의 변경 메뉴를 이용해주세요.`;
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
  // eslint-disable-next-line prefer-const
  let result: {
    template: { outputs: (carouselObject | simpleTextObject)[]; quickReplies: quickReplyObject[] };
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
  if (returnCode === 409)
    result.template.quickReplies.push({ label: '로그인 하기', messageText: '로그인', action: 'message' });
  else if (returnCode === 200) {
    result.template.outputs.push({
      simpleText: {
        text: `[기본회원정보]\n학번: ${user?.auth.studentID}\n이름: ${user?.info.name}\n나이: ${user?.info.age}}\n학과: ${user?.info.depart}\n전화번호: ${user?.info.phone}`,
      },
    });
    result.template.outputs.push({
      carousel: {
        type: 'listCard',
        header: undefined,
        items: [
          {
            header: { title: '기본적인 회원정보를 수정할 수 있는 메뉴 입니다.' },
            items: [
              {
                title: '비밀번호 변경',
                description: '카카오톡 로그인시 사용되는 비밀번호를 변경할 수 있습니다.',
                action: 'message',
                messageText: '비밀번호변경',
              },
              {
                title: '전화번호 변경',
                description: '데이터베이스에 등록된 휴대전화번호를 변경할 수 있습니다.',
                action: 'message',
                messageText: '전화번호변경',
              },
              {
                title: '학과/나이 변경',
                description: '데이터베이스에 등록된 학과/나이 정보를 변경할 수 있습니다.',
                action: 'message',
                messageText: '학과/나이변경',
              },
            ],
          },
        ],
      },
    });
  }
  res.status(200).json(result);
};
export { loginRespond, clubRoomRespond, userInfoRespond };
