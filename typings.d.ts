declare module '*.less' {
  const resource: { [key: string]: string };
  export = resource;
}

interface Env {
  ajax: (url: string, opt: Record<string, any>) => Promise<any>;
  [x: string]: any;
}
interface RuntimeParams<T> {
  data: T;
  env: Env;
  style: any;
  slots: any;
  inputs: any;
  outputs: any;
  logger: any;
  createPortal: any;
  title?: string;

  onError: (msg: string) => void;
}

interface EditorResult<T> {
  data: T;
  focusArea: any;
  output: any;
  input: any;
  slot: any;
  diagram: any;
  style: any;
  catelog: any;
  setAutoRun: (auto?: boolean) => void;
  isAutoRun: () => boolean;
  setDesc: (desc?: string) => void;
}

interface UpgradeParams<T> {
  id: string;
  data: T;
  output: any;
  input: any;
  slot: any;
  style: any;
  setAutoRun: (auto?: boolean) => void;
  isAutoRun: () => boolean;
  setDeclaredStyle: (selector: string | string[], style: React.CSSProperties, global?, withParentComId?: boolean) => void;
  getDeclaredStyle: (selector: string) => { selector: string; css: React.CSSProperties };
  removeDeclaredStyle: (selector: string) => void;
  config: {
    get: (id: string) => ConfigInstance;
  };
  children: any;
  /**
   * 注册权限信息
   * @param options 权限相关信息
   * @returns 注册后的权限ID
   */
  registerPermission: (options: { code: string; title: string }) => { id: string };
}


type ConfigInstance = {
  id: string;
  title: string;
  schema: Record<string, any>;
  connectionCount: number;
  setBinding: (binding: string) => void;
  setSchema: (schema: Record<string, any>) => void;
  setTitle: (title: string) => void;
  remove: () => void;
};

type AnyMap = {
  [key in string | number]: any;
};

interface Env {
  preview?: {};
  edit?: {};
  runtime?: any;
  mock?: {};
}
