import { Data } from "./types";

export default {
  ":root"({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = "配置";
    cate[0].items = [];
  },
  "@resize": {
      options: ['width','height']
    },
};
