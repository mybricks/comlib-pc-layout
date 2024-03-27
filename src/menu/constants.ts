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
    "_id": "Bm1RZE",
    "id": "3cwh8nmh6nw",
    "menuTitle": "可编辑表格测试",
    "route": "/menu1x",
    "pageId": "u_SZecd",
    "pageUrl": "https://fangzhou.kwaixiaodian.com/pcspa/CpWuyLVXqBeO/zYsXsrUxvBqk?layoutType=4&hyId=zYsXsrUxvBqk"
  },
  {
    "_id": "xZ4Eeh",
    "id": "1oshzpxmfey",
    "menuTitle": "树选择侧边栏demo",
    "pageUrl": "https://fangzhou.kwaixiaodian.com/pcspa/XKUFzHeNpDql/cIcWXRNuUKsE",
    "route": "/menu2x",
    "pageId": "u_SZecd"
  },
  {
    "_id": "ymBD9F",
    "id": "1qx0tf3sj4s",
    "pageUrl": "https://fangzhou.kwaixiaodian.com/pcspa/IbiJTDUZJplk/JegQKQOJLDWI?layoutType=4&hyId=JegQKQOJLDWI",
    "pageId": "u_SZecd",
    "route": "/menu3x",
    "menuTitle": "测试用子页面"
  },
  {
    "_id": "IddJiN",
    "id": "4mo2rkq9mew",
    "menuTitle": "来自test的页面",
    "route": "/menu4x",
    "pageId": "u_SZecd",
    "pageUrl": "https://test.mybricks.world/mfs/app/pcpage/test/545808963625029.html"
  },
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