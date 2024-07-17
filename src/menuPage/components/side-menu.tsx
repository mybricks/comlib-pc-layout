import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, message } from 'antd';
import { MenuItem, MenuTypeEnum } from '../type';
import { findSelectkeys, findMenuItem } from '../utils';

export default function SideMenu(props) {
  const { slots, env, dataSource, sideMenuWidth } = props;
  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  useEffect(() => {
    if (dataSource.length !== 0) {
      setSelectedKey([findSelectkeys(dataSource)]);
    }
  }, [dataSource]);

  const renderMenuItems = (ds: MenuItem[]) => {
    return (ds || []).map((item) => {
      const { key, children, menuType, useIcon, icon } = item || {};
      const title = item.title;
      //分组菜单
      if (menuType === MenuTypeEnum.Group) {
        return (
          <div data-menu-item={key} key={key}>
            <Menu.ItemGroup title={title} key={key}>
              {renderMenuItems(children)}
            </Menu.ItemGroup>
          </div>
        );
      }
      //父菜单
      if (menuType === MenuTypeEnum.SubMenu) {
        return (
          <Menu.SubMenu
            title={title}
            key={key}
            data-menu-item={key}
            //icon={useIcon ? chooseIcon({ icon: icon }) : void 0}
            style={{ opacity: 1, height: 'unset', overflowY: 'unset', position: 'relative' }}
          >
            {renderMenuItems(children)}
          </Menu.SubMenu>
        );
      }
      //最后的子菜单
      return (
        <Menu.Item
          onClick={menuOnClick}
          //icon={useIcon ? chooseIcon({ icon: icon }) : void 0}
          key={key}
          data-menu-item={key}
          //style={{ opacity: 1, height: 'unset', overflowY: 'unset', position: 'relative' }}
        >
          {title}
        </Menu.Item>
      );
    });
  };

  //子菜单的点击事件
  const menuOnClick = (e) => {
    const clickItem = findMenuItem(dataSource, e.key);
    const { key, _key, title, ...res } = clickItem;
    if (key) {
      //console.log('子项clickItem',clickItem);
    }
  };

  //菜单点击事件
  const onClick = (e) => {
    //const clickItem = findMenuItem(dataSource, e.key);
    setSelectedKey([e.key]);
  };

 return (
  <div style={{display: 'flex', height: '100%'}}>
    <div style={{width: sideMenuWidth}}>
      <Menu
        data-side-menu
        mode="vertical"
        selectedKeys={selectedKey}
        onClick={onClick}
      >
        {renderMenuItems(dataSource)}
      </Menu>
    </div>
    <div style={{width: '100%'}}>
      {slots[selectedKey[0]]?.render({
        key: selectedKey[0]
      })}
    </div>
  </div>
 )
}