import { MenuProps } from 'antd';
import { Data } from './type';
import { Outputs } from './constants';

export default {
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items: [
      {
        title: '展示顶部菜单',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showTopMenu;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.showTopMenu = val;
          }
        }
      },
      {
        title: '展示侧边菜单',
        type: 'Switch',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.showSideMenu;
          },
          set({ data }: EditorResult<Data>, val: boolean) {
            data.showSideMenu = val;
          }
        }
      }
    ]
  },
  '[data-top-menu]': {
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '顶部菜单';
      cate1.items = [
        
      ];

      cate2.title = '事件';
      cate2.items = [
        //...itemEvent(props), ...subItemsEvent(props), ...groupItemEvent(props)
      ];
    }
  },
  '[data-side-menu]': {
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '侧边菜单';
      cate1.items = [
        
      ];

      cate2.title = '事件';
      cate2.items = [
        //...itemEvent(props), ...subItemsEvent(props), ...groupItemEvent(props)
      ];
    }
  }
};
