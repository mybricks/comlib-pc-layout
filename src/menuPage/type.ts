export enum MenuTypeEnum {
  Menu = 'menu',
  SubMenu = 'subMenu',
  Group = 'group'
}
export interface MenuItem {
  _key: string;
  key: string;
  title: string;
  value?: any;
  menuType?: MenuTypeEnum;
  children: MenuItem[];
  defaultActive?: boolean;
  [key: string]: any;
  useIcon?: boolean;
  icon?: string;
}

export interface Data {
  router: string;
  url: string;
  /** 是否展示顶部菜单 */
  showTopMenu: boolean;
  /** 是否展示侧边菜单 */
  showSideMenu: boolean;
  dataSource: MenuItem[];

  sideMenuWidth: string;
  
  
  /** 顶部菜单 */
  topDataSource: MenuItem[];
  logo: string;
  logoSize: number[]
  leftMenus: any[]
  src: string;
  showLogo: boolean;
  showMenu: boolean;
  showAvatar: boolean;
}