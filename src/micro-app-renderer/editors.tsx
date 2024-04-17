import { Data } from "./types";

export default {
  "@resize": {
    options: ['width', 'height']
  },
  ":root"({ data }: EditorResult<Data>, ...cate) {
    cate[0].title = "配置";
    cate[0].items = [
      {
        title: '最小高度',
        description: `参考配置: 100vh - Header高度 - Footer高度 ("100vh"表示整个页面的高度，运行时生效)`,
        type: 'Text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.minHeight;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.minHeight = val;
          }
        }
      },
    ];
  },
};
