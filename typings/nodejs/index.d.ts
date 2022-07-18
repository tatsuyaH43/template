/// <reference types="node" />

// NOTE: the way to make the type of process.env more clear https://qiita.com/akameco/items/6567ccb1fd3b2e787f56
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';
  }
}

declare module 'postcss-object-fit-images';
declare module 'webpack-remove-empty-scripts';
// declare module 'nu-html-checker';
// declare module 'autodll-webpack-plugin';
