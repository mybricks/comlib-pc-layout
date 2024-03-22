import * as qiankun from 'qiankun';
import { SimpleMicroApp, LoadableApp } from '../types';

// export interface MApp {
//   name: string;
//   entry: string;
//   container: HTMLElement;
//   activeRule?: string;
// }

// interface AppItem {
//   [url: string]: MApp;
// }

class MainApp {
  // apps: MApp[] = [] as MApp[];

  // appsMap: AppItem = {};

  cacheHtmlMap = {};

  // isHashMode = true;

  // curUrl = '';

  // regist = ({ apps }: { apps: MApp[] }) => {
  //   this.apps = apps;

  //   apps.forEach((app) => {
  //     this.appsMap[app.activeRule] = app;
  //   });
  // };

  // start = () => {};

  // goto = (url, title) => {
  //   this.curUrl = url;
  //   const curApp = this.appsMap[this.curUrl];

  //   if (!curApp || !curApp.container || !curApp.entry) {
  //     console.warn('[micro app load fail] invalid app');
  //     return;
  //   }

  //   const { entry, container } = curApp;

  //   if (!this.cacheHtmlMap?.[entry]) {
  //     fetch(entry, {
  //       method: 'GET'
  //     })
  //       .then((res) => {
  //         if (res.headers.get('content-type') === 'text/plain') {
  //           return res.text();
  //         }
  //         return res.text();
  //       })
  //       .then((htmlString: string) => {
  //         this.cacheHtmlMap[entry] = htmlString;
  //         this.renderHtmlByHtmlString(htmlString, container);
  //       });
  //   } else {
  //     this.renderHtmlByHtmlString(this.cacheHtmlMap[entry], container);
  //   }
  // };

  loadApp = ({ entry, container }: { entry: string; container: HTMLElement }): SimpleMicroApp => {
    if (!this.cacheHtmlMap?.[entry]) {
      const mount: () => Promise<null> = async () => {
        await fetch(entry, {
          method: 'GET'
        })
          .then((res) => {
            if (res.headers.get('content-type') === 'text/plain') {
              return res.text();
            }
            return res.text();
          })
          .then((htmlString: string) => {
            const prefix = entry.split('/').slice(0, -1).join('/');
            /** test平台：相对地址处理成绝对地址 */
            const finalHtmlString = htmlString
              .replaceAll('src=".', `src="${prefix}`)
              .replaceAll('src="public', `src="${prefix}/public`)
              .replaceAll('href="public', `href="${prefix}/public`);
            this.cacheHtmlMap[entry] = finalHtmlString;
            this.renderHtmlByHtmlString(finalHtmlString, container);
          });
        return null;
      };

      const mountPromise = mount();

      const unmount: () => Promise<null> = () => Promise.resolve(null);

      return {
        getStatus: () => 'MOUNTED',
        mount,
        mountPromise,
        unmount
      };
    } else {
      const mount = () => {
        this.renderHtmlByHtmlString(this.cacheHtmlMap[entry], container);
        return Promise.resolve(null);
      };

      const mountPromise = mount();
      const unmount: () => Promise<null> = () => Promise.resolve(null);
      return {
        getStatus: () => 'MOUNTED',
        mount,
        mountPromise,
        unmount
      };
    }
  };

  loadInvalidApp = ({ container }: { container: HTMLElement }): SimpleMicroApp => {
    const mount: () => Promise<null> = () => {
      this.renderHtmlByHtmlString(
        `
        <body style="margin: 0px;">
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            font-style: italic;
            color: #999;
            font-weight: 400;
            font-size: 13px;
            height: 50px;
          ">当前页面未配置</div>
        </body>
        `,
        container
      );
      return Promise.resolve(null);
    };
    const mountPromise = mount();
    const unmount: () => Promise<null> = () => Promise.resolve(null);
    return {
      getStatus: () => 'MOUNTED',
      mount,
      mountPromise,
      unmount
    };
  };

  private renderHtmlByHtmlString = (htmlString: string, mountNode: HTMLElement) => {
    if (mountNode) {
      const iframeEle = document.createElement('iframe');
      mountNode.innerHTML = '';
      mountNode.appendChild(iframeEle);

      htmlString = htmlString.replace(
        '</head>',
        `
        <script>
          var parentHistory = window.parent.history;
          history.pushState = (...args) => {
            return parentHistory.pushState.apply(parentHistory, args)
          }
        </script>
        </head>
      `
      );
      window.iframeEle = iframeEle;

      iframeEle.style = 'width: 100%;height: 100%;border: 0px;border-radius: 0px;';

      iframeEle.contentWindow?.document.write(htmlString);
    }
  };
}

const mockMainApp = new MainApp();

// const openIframeMode = false
/** @description 设计器中 用iFrame渲染 */
const openIframeMode = () => {
  return (
    !!document.querySelector('div[class^="lyStage-"]') ||
    !!new URL(location.href).searchParams.get('microIframeMode')
  );
};

export const loadApp = ({ name, entry, container }: LoadableApp) => {
  if (openIframeMode()) {
    return mockMainApp.loadApp({ entry, container });
  }
  return qiankun.loadMicroApp({ name, entry, container }, { sandbox: true, singular: false });
};

export const loadInvalidApp = ({ container }: { container: HTMLElement }) => {
  return mockMainApp.loadInvalidApp({ container });
  // if (openIframeMode) {
  //   return mockMainApp.loadInvalidApp({ container })
  // }
  // return qiankun.loadMicroApp({ name: '__EMPTY__PAGE__', container, entry: {  html: EMPTY_HTML_STRING, styles: [] }  })
};

// export class RouteManager {
//   private _envType = location.pathname.startsWith('/runtime/mfs/staging') ? 'staging' : 'prod';
//   private _rootPath = location.pathname
//     .split('/')
//     .slice(0, this._envType === 'staging' ? 8 : 7)
//     .join('/');

//   onRouteChange: (url: string) => void = (url) => {};

//   init = ({ isHashMode = true, onRouteChange = (url: string) => {} } = {}) => {};

//   getRootPath() {
//     return this._rootPath;
//   }

//   getCurrentRoute = () => {
//     return location.pathname
//       .split('/')
//       .slice(this._envType === 'staging' ? 8 : 7)
//       .join('/');
//   };

//   goto = (url) => {
//     this.pushState(url);
//   };

//   replaceState(url = '') {
//     history.replaceState(null, '', url ? `${this._rootPath}/${url}` : '');
//   }

//   pushState(url = '') {
//     history.pushState(null, '', url);
//   }
// }
