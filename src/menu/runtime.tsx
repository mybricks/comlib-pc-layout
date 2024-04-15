import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Menu, message } from 'antd';
import { mockRouterParams } from './constants';
import dfs from '../utils/dfs';
import './style.less';
import { Data } from './type';
import Header from './components/header'

type RouteParam = {
  id: string;
  title: string;
  route: string;
  pageId: string;
  parentId?: string;
};
type RouteParams = RouteParam[];

export type HandleRouteDataNode = RouteParam & {
  dep: number;
  children?: HandleRouteDataNode[];
  parentNode?: HandleRouteDataNode;
};

function transToItems(data: HandleRouteDataNode[], canNotPushState: boolean = false) {
  return (
    data?.map((node) => {
      return {
        key: node.id,
        label: node.title,
        children: node.children && transToItems(node.children, canNotPushState),
        onClick: () => {
          if (node.children) return;
          if (canNotPushState) {
            message.info('请到预览页面调试路由跳转')
            return;
          }
          const completeRoute = window['layoutPC__basePathname'] + node.route;
          history.pushState({}, '', completeRoute);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      };
    }) || []
  );
}

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  // if (!env.runtime || env.runtime.debug) {
  //   window['layoutPC__basePathname'] = ""
  //   window['layoutPC__routerParams'] = mockRouterParams;
  //   window['layoutPC__userInfo'] = { nickname: 'jidan' };
  // }

  const [routerParams, setRouterParams] = useState<RouteParams>(window['layoutPC__routerParams']);
  const [showNodes, setShowNodes] = useState<HandleRouteDataNode[]>();
  const [curActiveNode, setCurActiveNode] = useState<HandleRouteDataNode>();

  /** 和壳应用通信 */
  useLayoutEffect(() => {
    window['layoutPC__onRouterParamsChange'] = window['layoutPC__onRouterParamsChange'] || [];
    window['layoutPC__onRouterParamsChange'].push(setRouterParams);
  }, []);

  /** 树形数据预处理 */
  const { nestedData } = useMemo(() => {
    // @ts-ignore
    const nestedData: HandleRouteDataNode[] = JSON.parse(JSON.stringify(routerParams)) || []

    function dfs(nodes: HandleRouteDataNode[], dep = 1, parentNode?: HandleRouteDataNode) {
      nodes.forEach((node) => {
        node.dep = dep;
        node.parentNode = parentNode;
        node.children && dfs(node.children, dep + 1, node);
      });
    }
    dfs(nestedData);

    return { nestedData };
  }, [routerParams]);

  /** 监听路由变化， */
  useLayoutEffect(() => {
    const onPopState = () => {
      if (!nestedData) return;
      let node = dfs(
        nestedData,
        'route',
        location.pathname.substring(window['layoutPC__basePathname']?.length)
      );
      setCurActiveNode(node);
      while (node && node.dep >= data.menuLevel) node = node.parentNode;
      setShowNodes(node?.children || []);
    };
    onPopState();
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  /** 菜单展示数据 */
  const items = useMemo(() => {
    const canNotPushState = !env.runtime || env.runtime.debug;
    if (data.menuLevel === 1 && data.menuDeep === -1) return transToItems(nestedData, canNotPushState);
    if (data.menuLevel === 1 && data.menuDeep === 0) {
      return transToItems(nestedData.map((item) => ({ ...item, children: undefined })), canNotPushState);
    }

    if (data.menuDeep === -1) return transToItems(showNodes);
    else return transToItems(showNodes.map((item) => ({ ...item, children: undefined })), canNotPushState);
  }, [showNodes, nestedData]);


  const isShowHeader = data.menuLevel === 1 && data.mode === 'horizontal';

  if (isShowHeader) {
    return <Header data={data} outputs={outputs} items={items} curActiveNode={curActiveNode} />
  }

  return <Menu style={{ height: '100%' }} mode={data.mode} items={items} activeKey={curActiveNode?.id} />
}
