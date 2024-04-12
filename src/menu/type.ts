import { MenuProps } from 'antd';

export interface Data {
  /** 展示第几级菜单，1-5级 */
  menuLevel: number;
  /** 展示菜单的深度，-1全展示，0只展示当前级 */
  menuDeep: number;
  mode: MenuProps['mode'];

  /** 是否展示logo */
  showLogo: boolean;
  /** logo地址 */
  logoUrl: string
  /** 是否展示用户信息 */
  showUserInfo: boolean;
}