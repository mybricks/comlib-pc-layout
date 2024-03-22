import { MicroApp } from 'qiankun';

type Compute<T extends object> = {
  [K in keyof T]: T[K]; // 映射
};

export type PartialPropsOption<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export type SimpleMicroApp = Compute<PartialPropsOption<
  MicroApp,
  'bootstrapPromise' | 'loadPromise' | 'unmountPromise' | 'update'
>>;

export interface Data {
  pageUrl: string;
}

export interface LoadableApp  {
  name: string;
  entry: string;
  container: HTMLElement
}