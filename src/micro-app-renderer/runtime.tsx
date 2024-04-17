import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import _debounce from 'lodash/debounce';
import { Data } from './types';
import styles from './style.less';
import { MicroApp, loadMicroApp } from 'qiankun';
import { Spin } from 'antd';
import dfs from '../utils/dfs';
export default function ({ data, env }: RuntimeParams<Data>) {
  const eleRef = useRef<HTMLDivElement>(null);
  const [pageUrl, setPageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  const loadApp = useCallback(() => {
    let _antd, __comlibs_rt_;
    if (pageUrl && eleRef.current) {
      return loadMicroApp(
        { name: pageUrl, entry: pageUrl, container: eleRef.current },
        {
          sandbox: {
            experimentalStyleIsolation: true
          },
          singular: true
        },
        {
          beforeLoad() {
            // @ts-expect-error 用于兼容解决内网方舟页面 m-ui 挂载逻辑
            _antd = window.antd;
            // @ts-expect-error
            delete window.antd;
            // @ts-expect-error 用于兼容解决__comlibs_rt_冲突
            __comlibs_rt_ = window.__comlibs_rt_;
            // @ts-expect-error
            delete window.__comlibs_rt_;
            return Promise.resolve();
          },
          afterMount() {
            // @ts-expect-error
            window.antd = _antd;
            // @ts-expect-error
            window.__comlibs_rt_ = __comlibs_rt_;
            return Promise.resolve();
          }
        }
      );
    }
  }, [pageUrl]);

  /** 监听路由变化， */
  useLayoutEffect(() => {
    const onPopState = () => {
      const node = dfs(
        window['layoutPC__routerParams'],
        'route',
        location.pathname.substring(window['layoutPC__basePathname']?.length)
      );
      setPageUrl(node?.pageUrl);
    };
    onPopState();
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useLayoutEffect(() => {
    let currentApp: MicroApp;
    const errorHandler = (event: PromiseRejectionEvent) => {
      if (event.reason.message?.startsWith('[qiankun]: Wrapper element for')) {
        currentApp = loadApp();
      }
    };
    window.addEventListener('unhandledrejection', errorHandler);
    return () => {
      currentApp?.unmount();
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, [loadApp]);

  useLayoutEffect(() => {
    const currentApp = loadApp();
    return () => {
      currentApp?.unmount();
    };
  }, [loadApp]);

  return (
    <div className={styles.pageRender} style={{ ...(!!data.minHeight && !env.edit ? { minHeight: `calc(${data.minHeight})` } : {}) }}>
      <Spin spinning={loading} tip='加载中...'>
        {env.edit ? (
          <div className={styles.tip}>这里是页面渲染区域</div>
        ) : (
          <div className={styles.rtMountNode} ref={eleRef} />
        )}
      </Spin>
    </div>
  );
}
