import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import _debounce from 'lodash/debounce';
import { Data, SimpleMicroApp, LoadableApp } from './types';
import { Spin } from 'antd';
import styles from './style.less';
import { loadApp, loadInvalidApp } from './utils/qiankun-polyfill';

class AppManager {
  private curLoadedMicroApp: SimpleMicroApp | null = null;
  private curLoadableMicroApp: LoadableApp | null = null;
  private loadedMicroAppMap: { [keyName: string]: SimpleMicroApp } = {};

  private _switch = _debounce(async (loadableMicroApp: LoadableApp) => {
    await this.unmountCurApp();
    this.curLoadableMicroApp = loadableMicroApp;
    if (!!this.loadedMicroAppMap[loadableMicroApp.name]) {
      await this.loadedMicroAppMap[loadableMicroApp.name].mount();
      this.curLoadedMicroApp = this.loadedMicroAppMap[loadableMicroApp.name];
      return Promise.resolve();
    } else if (!!!this.loadedMicroAppMap[loadableMicroApp.name]) {
      this.curLoadedMicroApp = loadApp(loadableMicroApp);
      this.loadedMicroAppMap[loadableMicroApp.name] = this.curLoadedMicroApp;
      return this.curApp?.mountPromise;
    }
    return Promise.resolve();
  }, 300);

  unmountCurApp = async () => {
    if (!this.curApp) {
      return Promise.resolve();
    }

    if (this.curApp.getStatus() !== 'MOUNTED') {
      return Promise.resolve();
    }

    return this.curApp.unmount();
  };

  switchApp = async (loadableMicroApp: LoadableApp) => {
    if (this.curApp?.name === loadableMicroApp.name) {
      return Promise.resolve();
    }
    return this._switch(loadableMicroApp);
  };

  switchInvalidApp = async ({ container }: { container: HTMLElement }) => {
    await appManager.unmountCurApp();
    this.curLoadedMicroApp = loadInvalidApp({ container });
    return Promise.resolve();
  };

  get curApp() {
    const curApp = this.curLoadedMicroApp;

    return (
      curApp && {
        ...curApp,
        name: this.curLoadableMicroApp?.name
      }
    );
  }
}

const appManager = new AppManager();

export default function ({ data, inputs, outputs, slots, env }: RuntimeParams<Data>) {
  // if (!env.runtime || env.runtime.debug) {
  //   window['layoutPC__basePathname'] = ""
  // }

  /** 监听路由变化， */
  useLayoutEffect(() => {
    const onPopState = () => {
      const node = window?.['layoutPC__routerParams']?.find((item) => window['layoutPC__basePathname'] + item.route === location.pathname);
      data.pageUrl = node?.pageUrl
    };
    onPopState();
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const eleRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eleRef.current) return;
    if (!data.pageUrl) {
      console.warn('[micro app] invalid app,url is required');
      appManager.switchInvalidApp({ container: eleRef.current });
    } else {
      setLoading(true);
      // 用于兼容解决内网方舟页面 m-ui 挂载逻辑
      const _antd = window.antd;
      delete window.antd;
      appManager
        .switchApp({ name: data.pageUrl, entry: data.pageUrl, container: eleRef.current })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          let timer: NodeJS.Timer | null = setInterval(() => {
            if (
              appManager.curApp &&
              data.pageUrl === appManager.curApp.name &&
              appManager.curApp.getStatus() === 'MOUNTED'
            ) {
              window.antd = _antd;
              timer && clearInterval(timer);
              timer = null;
              setLoading(false);
            }
          }, 100);
        });
    }
  }, [data.pageUrl]);

  return (
    <div className={styles.pageRender}>
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
