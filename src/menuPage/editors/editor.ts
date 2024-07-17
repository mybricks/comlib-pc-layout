import { title } from 'process';
import { Outputs, uuid } from '../constants';
import { Data, MenuTypeEnum } from '../type';
import { getMenuItem, setMenuItem, getTopMenuItem, setTopMenuItem, itemHandle, removeKeys, removeOutput, addOutput, dataHandle } from '../utils';
import { subItemArr } from './subItemsArr';

export default {
  '@init'({ style, slot }) {
    style.width = 1024
    style.height = 800
    slot.add({
      id: "menu1",
      title: "菜单1"
    });
  },
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
      },
      {
        title: '路由',
        type: 'text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.router;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.router = val;
          }
        }
      },
      {
        title: '子应用URL',
        type: 'text',
        value: {
          get({ data }: EditorResult<Data>) {
            return data.url;
          },
          set({ data }: EditorResult<Data>, val: string) {
            data.url = val;
          }
        }
      }
    ]
  },
  '[data-top-menu]': {
    title: '顶部菜单',
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '顶部菜单';
      cate1.items = [
        {
          title: '展示顶部区域',
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
          title: '展示logo',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.showLogo;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.showLogo = val;
            }
          }
        },
        {
          title: '展示顶部菜单',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.showMenu;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.showMenu = val;
            }
          }
        },
        {
          title: '展示头像',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.showAvatar;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.showAvatar = val;
            }
          }
        }
      ];

      cate2.title = '事件';
      cate2.items = [
        //...itemEvent(props), ...subItemsEvent(props), ...groupItemEvent(props)
      ];
    }
  },
  '[data-top-menu-list]': {
    title: '顶部菜单',
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '顶部菜单';
      cate1.items = [
        {
          title: '展示顶部菜单',
          type: 'Switch',
          value: {
            get({ data }: EditorResult<Data>) {
              return data.showMenu;
            },
            set({ data }: EditorResult<Data>, val: boolean) {
              data.showMenu = val;
            }
          }
        },
        {
          title: '静态数据',
          type: 'Tree',
          options: {
            getTitle: (item) => {
              if (!item.key) {
                item.key = uuid();
              }
              return item.title || `菜单${item.key}`;
            },
            onAdd: () => {
              const key = uuid();
              return {
                key,
                _key: key,
                menuType: MenuTypeEnum.Menu,
                defaultActive: false,
                title: `菜单${key}`
              };
            },
            addItemGoal: {
              key: 'menuType',
              value: [MenuTypeEnum.SubMenu, MenuTypeEnum.Group]
            },
            items: [
              {
                title: '标题',
                type: 'TextArea',
                value: 'title',
                options: {
                  autoSize: { maxRows: 1 },
                  locale: true
                }
              },
              {
                title: '唯一标识',
                type: 'TextArea',
                value: 'key',
                options: {
                  autoSize: { maxRows: 1 }
                }
              },
              {
                title: '默认激活',
                type: 'Switch',
                frontIndex: 2,
                ifVisible(item) {
                  return item.menuType === MenuTypeEnum.Menu;
                },
                value: 'defaultActive'
              },
              {
                title: '类型',
                type: 'Select',
                frontIndex: 1,
                options: [
                  { label: '子菜单', value: MenuTypeEnum.Menu },
                  { label: '父菜单', value: MenuTypeEnum.SubMenu }
                ],
                value: 'menuType'
              },
              {
                title: '类型',
                type: 'Select',
                afterIndex: 2,
                options: [
                  { label: '子菜单', value: MenuTypeEnum.Menu },
                  { label: '父菜单', value: MenuTypeEnum.SubMenu },
                  { label: '分组菜单', value: MenuTypeEnum.Group }
                ],
                value: 'menuType'
              }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.topDataSource;
            },
            set(props: EditorResult<Data>, val: any[]) {
              //删除菜单项操作
            if (val.length < props.data.topDataSource.length) {
              removeOutput(props.data.topDataSource, val, props.output, props.slot);
            }
            //增加菜单项操作
            if (val.length > props.data.topDataSource.length) {
              addOutput(props.data.topDataSource, val, props.output, props.slot);
            }
            if (val.length === props.data.topDataSource.length) {
              for (let i = 0; i < val.length; i++) {
                //如果从子菜单切换到父菜单，去除该项的点击事件
                if (
                  val[i].menuType === MenuTypeEnum.SubMenu &&
                  props.data.topDataSource[i].menuType === MenuTypeEnum.Menu
                ) {
                  props.output.remove(val[i]._key);
                } else if (val[i].menuType === MenuTypeEnum.Menu) {
                  //如果从父菜单切换到子菜单，去除该项子项的点击事件
                  props.output.add(val[i]._key, `点击${val[i].title}`, { type: 'any' });
                  removeKeys(val[i].children || [], props);
                }
              }
            }

            //根据激活项唯一处理数据源(删除菜单项，增加菜单项，仅改变菜单项配置)
            //let newVal =
            //dataHandle(data.dataSource, val);
            props.data.topDataSource = dataHandle(props.data.topDataSource, val);
            }
          }
        },
      ];

      cate2.title = '事件';
      cate2.items = [
        //...itemEvent(props), ...subItemsEvent(props), ...groupItemEvent(props)
      ];
    }
  },
  '[data-logo]'({ data }, cate1) {
    cate1.title = 'Logo配置';
    cate1.items = [
      {
        type: 'imageSelector',
        value: {
          get({ data }) {
            return data.logo
          },
          set({ data }, url: string) {
            data.logo = url;
          }
        }
      },
      {
        title: '尺寸',
        type: 'InputNumber',
        options: [
          { title: '高度', min: 0, width: 100 },
          { title: '宽度', min: 0, width: 100 }
        ],
        value: {
          get({ data }) {
            return data.logoSize || [86, 32];
          },
          set({ data }, value: [number, number]) {
            data.logoSize = value;
          }
        }
      },
    ]
  },
  '[data-title]'({ data }, cate1) {
    cate1.title = '应用标题配置';
    cate1.items = [
      {
        title: '标题',
        type: 'Text',
        value: {
          get({ data }) {
            return data.title
          },
          set({ data }, url: string) {
            data.title = url;
          }
        }
      }
    ]
  },
  '[data-avatar]'({ data }, cate1) {
    cate1.title = '用户头像配置';
    cate1.items = [
      {
        type: 'imageSelector',
        value: {
          get({ data }) {
            return data.avatar
          },
          set({ data }, url: string) {
            data.avatar = url;
          }
        }
      },
    ]
  },
  '[data-user-name]'({ data }, cate1) {
    cate1.title = '用户名';
    cate1.items = [
      {
        type: 'Text',
        value: {
          get({ data }) {
            return data.userName
          },
          set({ data }, val: string) {
            data.userName = val;
          }
        }
      },
    ]
  },
  '[data-top-menu-item]': {
    title: '顶部菜单项',
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '菜单项';
      cate1.items = [
        {
          title: '标题',
          type: 'Text',
          options: {
            locale: true
          },
          value: {
            get(props: EditorResult<Data>) {
              return getTopMenuItem(props, 'title');
            },
            set(props: EditorResult<Data>, value: string) {
              setTopMenuItem(props, 'title', value);
            }
          }
        },
        {
          title: '唯一标识',
          type: 'Text',
          value: {
            get(props: EditorResult<Data>) {
              return getTopMenuItem(props, 'key');
            },
            set(props: EditorResult<Data>, value: string) {
              setTopMenuItem(props, 'key', value);
              props.output.add(value, `点击${getTopMenuItem(props, 'title')}`, { type: 'any' });
            }
          }
        },
        {
          title: '默认激活',
          type: 'Switch',
          ifVisible(props: EditorResult<Data>) {
            return getTopMenuItem(props, 'menuType') === MenuTypeEnum.Menu;
          },
          value: {
            get(props: EditorResult<Data>) {
              return getTopMenuItem(props, 'defaultActive');
            },
            set(props: EditorResult<Data>, value: boolean) {
              setTopMenuItem(props, 'defaultActive', value);

              //默认激活的互斥, 整体数据处理
              if (value === true) {
                let selectedKey = getTopMenuItem(props, 'key');
                //对dataSource整体遍历
                let newval = itemHandle(selectedKey, props.data.topDataSource);
                props.data.topDataSource = newval;
              }
            }
          }
        },
        //...IconEditor,
        {
          title: '类型',
          type: 'Select',
          options: [
            { label: '子菜单', value: MenuTypeEnum.Menu },
            { label: '父菜单', value: MenuTypeEnum.SubMenu }
          ],
          value: {
            get(props: EditorResult<Data>) {
              return getTopMenuItem(props, 'menuType');
            },
            set(props: EditorResult<Data>, value: MenuTypeEnum) {
              //1、从子菜单，切换到父菜单，去除默认勾选状态，且去除其选中状态
              if (
                value === MenuTypeEnum.SubMenu &&
                getTopMenuItem(props, 'menuType') === MenuTypeEnum.Menu
              ) {
                setTopMenuItem(props, 'defaultActive', false);
                const childKey = uuid();
                const defaultChild = [
                  {
                    title: '子菜单1',
                    key: childKey,
                    _key: childKey,
                    menuType: MenuTypeEnum.Menu,
                    children: []
                  }
                ];
                setTopMenuItem(props, 'children', defaultChild);
                props.output.add(childKey, `点击${getTopMenuItem(props, 'children')[0].title}`, {
                  type: 'any'
                });
                props.output.remove(getTopMenuItem(props, '_key'));
                //2、从父菜单，切换到子菜单，去除子项点击事件输出
              } else if (
                value === MenuTypeEnum.Menu &&
                getTopMenuItem(props, 'menuType') === MenuTypeEnum.SubMenu
              ) {
                props.output.add(getTopMenuItem(props, '_key'), `点击${getTopMenuItem(props, 'title')}`, {
                  type: 'any'
                });

                if (
                  getTopMenuItem(props, 'children') !== undefined ||
                  getTopMenuItem(props, 'children').length !== 0
                ) {
                  removeKeys(getTopMenuItem(props, 'children'), props);
                }
                setTopMenuItem(props, 'children', []);
              }
              setTopMenuItem(props, 'menuType', value);
            }
          }
        },
        ...subItemArr(props),
        //...groupItemArr(props),
        {
          items: [
            {
              title: '删除',
              type: 'Button',
              value: {
                set(props: EditorResult<Data>) {
                  //1.删除所有项的key
                  props.output.remove(getTopMenuItem(props).key);
                  if (getTopMenuItem(props).children) {
                    removeKeys(getTopMenuItem(props), props);
                  }
                  let newVal = props.data.dataSource.filter((item) => {
                    return item !== getTopMenuItem(props);
                  });
                  props.data.dataSource = newVal;
                }
              }
            }
          ]
        }
      ];

      cate2.title = '事件';
      cate2.items = [
        //...itemEvent(props), ...subItemsEvent(props), ...groupItemEvent(props)
      ];
    },
  },
  '[data-side-menu]': {
    title: '侧边菜单',
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '侧边菜单';
      cate1.items = [
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
        },
        {
          title: '侧边菜单宽度',
          type: 'text',
          description: '图标尺寸,支持百分比和定宽',
          value: {
            get({ data }: EditorResult<Data>) {
              return String(data.sideMenuWidth);
            },
            set({ data }: EditorResult<Data>, value: string) {
              if (/^\d+$/.test(value)) {
                data.sideMenuWidth = `${value}px`;
              } else {
                data.sideMenuWidth = value;
              }
            }
          }
        },
        {
          title: '静态数据',
          type: 'Tree',
          options: {
            getTitle: (item) => {
              if (!item.key) {
                item.key = uuid();
              }
              return item.title || `菜单${item.key}`;
            },
            onAdd: () => {
              const key = uuid();
              return {
                key,
                _key: key,
                menuType: MenuTypeEnum.Menu,
                defaultActive: false,
                title: `菜单${key}`
              };
            },
            addItemGoal: {
              key: 'menuType',
              value: [MenuTypeEnum.SubMenu, MenuTypeEnum.Group]
            },
            items: [
              {
                title: '标题',
                type: 'TextArea',
                value: 'title',
                options: {
                  autoSize: { maxRows: 1 },
                  locale: true
                }
              },
              {
                title: '唯一标识',
                type: 'TextArea',
                value: 'key',
                options: {
                  autoSize: { maxRows: 1 }
                }
              },
              {
                title: '默认激活',
                type: 'Switch',
                frontIndex: 2,
                ifVisible(item) {
                  return item.menuType === MenuTypeEnum.Menu;
                },
                value: 'defaultActive'
              },
              {
                title: '类型',
                type: 'Select',
                frontIndex: 1,
                options: [
                  { label: '子菜单', value: MenuTypeEnum.Menu },
                  { label: '父菜单', value: MenuTypeEnum.SubMenu }
                ],
                value: 'menuType'
              },
              {
                title: '类型',
                type: 'Select',
                afterIndex: 2,
                options: [
                  { label: '子菜单', value: MenuTypeEnum.Menu },
                  { label: '父菜单', value: MenuTypeEnum.SubMenu },
                  { label: '分组菜单', value: MenuTypeEnum.Group }
                ],
                value: 'menuType'
              }
            ]
          },
          value: {
            get({ data }: EditorResult<Data>) {
              return data.dataSource;
            },
            set(props: EditorResult<Data>, val: any[]) {
              //删除菜单项操作
            if (val.length < props.data.dataSource.length) {
              removeOutput(props.data.dataSource, val, props.output, props.slot);
            }
            //增加菜单项操作
            if (val.length > props.data.dataSource.length) {
              addOutput(props.data.dataSource, val, props.output, props.slot);
            }
            if (val.length === props.data.dataSource.length) {
              for (let i = 0; i < val.length; i++) {
                //如果从子菜单切换到父菜单，去除该项的点击事件
                if (
                  val[i].menuType === MenuTypeEnum.SubMenu &&
                  props.data.dataSource[i].menuType === MenuTypeEnum.Menu
                ) {
                  props.output.remove(val[i]._key);
                } else if (val[i].menuType === MenuTypeEnum.Menu) {
                  //如果从父菜单切换到子菜单，去除该项子项的点击事件
                  props.output.add(val[i]._key, `点击${val[i].title}`, { type: 'any' });
                  removeKeys(val[i].children || [], props);
                }
              }
            }

            //根据激活项唯一处理数据源(删除菜单项，增加菜单项，仅改变菜单项配置)
            //let newVal =
            //dataHandle(data.dataSource, val);
            props.data.dataSource = dataHandle(props.data.dataSource, val);
            }
          }
        },
      ];

      cate2.title = '事件';
      cate2.items = [
        //...itemEvent(props), ...subItemsEvent(props), ...groupItemEvent(props)
      ];
    }
  },
  '[data-menu-item]': {
    title: '侧边菜单项',
    items: (props: EditorResult<Data>, cate1, cate2) => {
      cate1.title = '菜单项';
      cate1.items = [
        {
          title: '标题',
          type: 'Text',
          options: {
            locale: true
          },
          value: {
            get(props: EditorResult<Data>) {
              return getMenuItem(props, 'title');
            },
            set(props: EditorResult<Data>, value: string) {
              setMenuItem(props, 'title', value);
            }
          }
        },
        {
          title: '唯一标识',
          type: 'Text',
          value: {
            get(props: EditorResult<Data>) {
              return getMenuItem(props, 'key');
            },
            set(props: EditorResult<Data>, value: string) {
              setMenuItem(props, 'key', value);
              props.output.add(value, `点击${getMenuItem(props, 'title')}`, { type: 'any' });
            }
          }
        },
        {
          title: '默认激活',
          type: 'Switch',
          ifVisible(props: EditorResult<Data>) {
            return getMenuItem(props, 'menuType') === MenuTypeEnum.Menu;
          },
          value: {
            get(props: EditorResult<Data>) {
              return getMenuItem(props, 'defaultActive');
            },
            set(props: EditorResult<Data>, value: boolean) {
              setMenuItem(props, 'defaultActive', value);

              //默认激活的互斥, 整体数据处理
              if (value === true) {
                let selectedKey = getMenuItem(props, 'key');
                //对dataSource整体遍历
                let newval = itemHandle(selectedKey, props.data.dataSource);
                props.data.dataSource = newval;
              }
            }
          }
        },
        //...IconEditor,
        {
          title: '类型',
          type: 'Select',
          options: [
            { label: '子菜单', value: MenuTypeEnum.Menu },
            { label: '父菜单', value: MenuTypeEnum.SubMenu }
          ],
          value: {
            get(props: EditorResult<Data>) {
              return getMenuItem(props, 'menuType');
            },
            set(props: EditorResult<Data>, value: MenuTypeEnum) {
              //1、从子菜单，切换到父菜单，去除默认勾选状态，且去除其选中状态
              if (
                value === MenuTypeEnum.SubMenu &&
                getMenuItem(props, 'menuType') === MenuTypeEnum.Menu
              ) {
                setMenuItem(props, 'defaultActive', false);
                const childKey = uuid();
                const defaultChild = [
                  {
                    title: '子菜单1',
                    key: childKey,
                    _key: childKey,
                    menuType: MenuTypeEnum.Menu,
                    children: []
                  }
                ];
                setMenuItem(props, 'children', defaultChild);
                props.output.add(childKey, `点击${getMenuItem(props, 'children')[0].title}`, {
                  type: 'any'
                });
                props.output.remove(getMenuItem(props, '_key'));
                //2、从父菜单，切换到子菜单，去除子项点击事件输出
              } else if (
                value === MenuTypeEnum.Menu &&
                getMenuItem(props, 'menuType') === MenuTypeEnum.SubMenu
              ) {
                props.output.add(getMenuItem(props, '_key'), `点击${getMenuItem(props, 'title')}`, {
                  type: 'any'
                });

                if (
                  getMenuItem(props, 'children') !== undefined ||
                  getMenuItem(props, 'children').length !== 0
                ) {
                  removeKeys(getMenuItem(props, 'children'), props);
                }
                setMenuItem(props, 'children', []);
              }
              setMenuItem(props, 'menuType', value);
            }
          }
        },
        ...subItemArr(props),
        //...groupItemArr(props),
        {
          items: [
            {
              title: '删除',
              type: 'Button',
              value: {
                set(props: EditorResult<Data>) {
                  //1.删除所有项的key
                  props.output.remove(getMenuItem(props).key);
                  if (getMenuItem(props).children) {
                    removeKeys(getMenuItem(props), props);
                  }
                  let newVal = props.data.dataSource.filter((item) => {
                    return item !== getMenuItem(props);
                  });
                  props.data.dataSource = newVal;
                }
              }
            }
          ]
        }
      ];

      cate2.title = '事件';
      cate2.items = [
        //...itemEvent(props), ...subItemsEvent(props), ...groupItemEvent(props)
      ];
    },
  }
};
