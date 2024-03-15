import { MenuProps } from 'antd';
import { Data } from './constants';

export default {
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items: [
      {
        title: '展示菜单',
        description: '展示哪一级的菜单',
        type: 'Select',
        options: [
          { label: '主菜单', value: 1 },
          { label: '二级菜单', value: 2 },
          { label: '三级菜单', value: 3 },
          { label: '四级菜单', value: 4 },
          { label: '五级菜单', value: 5 }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.menuLevel;
          },
          set({ data }: EditorResult<Data>, val: number) {
            data.menuLevel = val;
          }
        }
      },
      {
        title: '展示深度',
        description: '从当前展示级菜单向下展示几级的菜单',
        type: 'Select',
        options: [
          { label: '全部展示', value: -1 },
          { label: '不展示', value: 0 }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.menuDeep;
          },
          set({ data }: EditorResult<Data>, val: number) {
            data.menuDeep = val;
          }
        }
      },
      {
        title: '样式',
        type: 'Select',
        options: [
          { label: '水平', value: 'horizontal' },
          { label: '垂直', value: 'vertical' },
          { label: '内嵌', value: 'inline' }
        ],
        value: {
          get({ data }: EditorResult<Data>) {
            return data.mode;
          },
          set({ data }: EditorResult<Data>, val: MenuProps['mode']) {
            data.mode = val;
          }
        }
      }
    ]
  }
};
