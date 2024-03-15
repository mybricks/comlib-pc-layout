import { MenuProps } from 'antd';

export interface Data {
  /** 展示第几级菜单，1-5级 */
  menuLevel: number;
  /** 展示菜单的深度，-1全展示，0只展示当前级 */
  menuDeep: number;
  mode: MenuProps['mode'];
}
