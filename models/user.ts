import { Model, model, Schema } from 'mongoose';

interface UserObject {
  _id: Schema.Types.ObjectId;
  info: {
    name: string;
    depart: string;
    age: number;
    phone: string;
    dues: boolean;
  };
  auth: {
    kakaoTalk: string;
    type: string;
    studentID: number;
    passCode: number;
  };
  game: {
    league: {
      win: {
        count: number;
        data: Schema.Types.Array;
      };
      lose: {
        count: number;
        data: Schema.Types.Array;
      };
      draw: {
        count: number;
        data: Schema.Types.Array;
      };
    };
    ranking: {
      win: {
        count: number;
        data: Schema.Types.Array;
      };
      lose: {
        count: number;
        data: Schema.Types.Array;
      };
      draw: {
        count: number;
        data: Schema.Types.Array;
      };
    };
    custom: {
      win: {
        count: number;
        data: Schema.Types.Array;
      };
      lose: {
        count: number;
        data: Schema.Types.Array;
      };
      draw: {
        count: number;
        data: Schema.Types.Array;
      };
    };
  };
}

const UserSchema: Schema = new Schema(
  {
    info: {
      name: String,
      depart: String,
      age: Number,
      phone: String,
      dues: Boolean,
    },
    auth: {
      kakaoTalk: String,
      type: {
        type: String,
        enum: ['임원', '기존', '신규'],
      },
      studentID: Number,
      passCode: Number,
    },
    game: {
      league: {
        win: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
        lose: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
        draw: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
      },
      ranking: {
        win: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
        lose: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
        draw: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
      },
      custom: {
        win: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
        lose: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
        draw: {
          count: {
            type: Number,
            default: 0,
          },
          data: {
            type: Schema.Types.Array,
            default: [],
          },
        },
      },
    },
  },
  {
    versionKey: false,
  },
);
const UserModel: Model<UserObject> = model<UserObject>('user', UserSchema);
export { UserModel, UserObject };
