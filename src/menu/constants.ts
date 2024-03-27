import { MenuProps } from 'antd';

export interface Data {
  /** 展示第几级菜单，1-5级 */
  menuLevel: number;
  /** 展示菜单的深度，-1全展示，0只展示当前级 */
  menuDeep: number;
  mode: MenuProps['mode'];
}

export const mockRouterParams = [
  {
    "_id": "3DFF6U",
    "id": "26fgfa52ogw",
    "menuTitle": "menu1",
    "route": "/menu1",
    "pageId": "u_0H5Ua"
  },
  {
    "_id": "q9Ys8z",
    "id": "4helcpvdstg",
    "menuTitle": "menu2",
    "route": "/menu2",
    "pageId": "u_SZecd",
    "pageUrl": "https://fangzhou.kwaixiaodian.com/pcspa/rtx-zys/RXiAeMfbGhSO"
  },
  {
    "_id": "AoKevu",
    "id": "s0modfupe0",
    "menuTitle": "menu3",
    "route": "/menu3",
    "pageId": "u_SZecd",
    "pageUrl": "https://fangzhou.kwaixiaodian.com/pcspa/rtx-zys/RXiAeMfbGhSO"
  },
  {
    "_id": "GvfwzI",
    "id": "11a6bej4rxg.i",
    "menuTitle": "sub-menu1",
    "route": "/menu1/sub-menu1",
    "pageId": "u_0H5Ua",
    "parentId": "26fgfa52ogw",
    "pageUrl": "https://fangzhou.kwaixiaodian.com/pcspa/fangzhou/tvTvEThZYvfo"
  },
  {
    "_id": "GY2bwB",
    "id": "3ahulp2c2fe",
    "menuTitle": "sub-menu2",
    "route": "/menu1/sub-menu2",
    "pageId": "u_0H5Ua",
    "parentId": "26fgfa52ogw",
    "pageUrl": "https://fangzhou.kwaixiaodian.com/pcspa/rtx-zys/RXiAeMfbGhSO"
  },
  {
    "_id": "CVrKbp",
    "id": "1cqcpfj3x0l",
    "route": "/menu1/sub-menu2/sub-sub1",
    "menuTitle": "subsub1",
    "pageId": "u_0H5Ua",
    "parentId": "11a6bej4rxg.i",
    "pageUrl": "https://fangzhou.kwaixiaodian.com/pcspa/rtx-zys/RXiAeMfbGhSO"
  },
  {
    "_id": "Xe36M5",
    "id": "au3syfl0kw.e",
    "menuTitle": "菜单4",
    "route": "/menu4",
    "pageId": "u_SZecd",
    "pageUrl": "http://47.97.7.43/"
  }
]