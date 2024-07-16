import React, { useLayoutEffect, useMemo, useState } from 'react';
import { message } from 'antd';
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
  <div>
    {data.showTopMenu ?
      <TopMenu/> 
    : void 0}
    {data.showSideMenu ? 
      <SideMenu
      items={items}
      slots={slots}
      />   
    :void 0}
    {slots['body'].render({
        style: { overflow: 'auto' }
    })}
  </div>
 )
}