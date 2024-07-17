import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { message, Menu } from 'antd';
import type { MenuProps } from 'antd';
import TopMenu from './components/top-menu';
import SideMenu from './components/side-menu';

type MenuItem = Required<MenuProps>['items'][number];

export default function ({ env, _env, data, slots, outputs, inputs, logger, style }) {
  const items: MenuItem[] = [
    {
      key: 'sub1',
      label: 'Navigation One'
    },
    {
      key: 'sub2',
      label: 'Navigation Two'
    },
    {
      key: 'sub4',
      label: 'Navigation Three'
    }
  ];

  return (
    <div style={{display: 'flex', flexDirection:'column', height: '100%'}}>
      <div>
        {data.showTopMenu ?
          <TopMenu
            dataSource={data.topDataSource}
            slots={slots}
            env={env}
            logo={data.logo}
            logoSize={data.logoSize}
            avatar={data.avatar}
            userName={data.userName}
            showLogo={data.showLogo}
            showMenu={data.showMenu}
            showAvatar={data.showAvatar}
            title={data.title}
          /> 
        : void 0}
      </div>
      <div style={{flex: 1}}> 
        {data.showSideMenu ? 
          <SideMenu
            dataSource={data.dataSource}
            slots={slots}
            env={env}
            sideMenuWidth={data.sideMenuWidth}
          />   
        :void 0}
      </div>
      
    </div>
  )
}