import { resolve, relative } from 'path';
import { Configuration, Compiler } from 'webpack';
import { existsSync } from 'fs';
import chalk from 'chalk';

// misc libs
import _glob from 'glob';
import beautify from 'js-beautify';

// webpack plugins
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import ImageminPlugin from 'imagemin-webpack-plugin';
import ImageminMozjpeg from 'imagemin-mozjpeg';

// sass plugins
import autoprefixer from 'autoprefixer';
import objectfit from 'postcss-object-fit-images';
import cssnano from 'cssnano';
import sassGlobImporter from 'node-sass-glob-importer';

const isProduction = process.env.NODE_ENV === 'production';
const TSCONFIG_PATH = resolve(__dirname, './tsconfig.json');

/**
 * glob ファイルを取得します。
 * @param  {string} pattern globパターン
 * @returns Promise
 */
const glob = (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    _glob(pattern, (error, matches) => {
      if (error) {
        reject(error);
      } else {
        resolve(matches);
      }
    });
  });
};

/**
 * コンパイル時のクエリー付与
 * @param  {string} filepath ファイルのパス
 */
const composeRenderStaticQuery = (filepath: string) => {
  const tsxPath = resolve(__dirname, './src/render-static.tsx');
  const targetPath = resolve(__dirname, filepath);

  return `${tsxPath}?filepath=${targetPath}`;
};

/**
 * プラグイン
 * @param  {Compiler} compiler
 */
export class PostHtmlPlugin {
  private static NAME = 'PostHtmlPlugin';
  private devServer?: WebpackDevServer;

  /**
   * Beautify HTML
   */
  public apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(PostHtmlPlugin.NAME, (compilation) => {
      // Beautify HTML
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(PostHtmlPlugin.NAME, (data, cb) => {
        data.html = beautify.html(data.html, {
          indent_size: 2,
          indent_inner_html: true,
          content_unformatted: ['script'],
          extra_liners: [],
        });
        cb(null, data);
      });

      // Notify `webpack-dev-server` with `hot: true` to update static HTML
      // @see https://github.com/jantimon/html-webpack-plugin/issues/100#issuecomment-368303060
      HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(PostHtmlPlugin.NAME, (data, cb) => {
        if (this.devServer && this.devServer.webSocketServer) {
          this.devServer.sendMessage(this.devServer.webSocketServer.clients, 'content-changed');
        }
        cb(null, data);
      });
    });

    // Obtain webpack-dev-server instance
    compiler.hooks.afterEnvironment.tap(PostHtmlPlugin.NAME, () => {
      if (compiler.options.devServer) {
        const originalFunc = compiler.options.devServer.onBeforeSetupMiddleware || (() => {});

        compiler.options.devServer.onBeforeSetupMiddleware = (app: any, server: any) => {
          this.devServer = server;
          originalFunc(app, server, compiler);
        };
      }
    });
  }
}

const createRegionConfig = async (env: { page?: string } = {}): Promise<Configuration> => {
  const pagePath = env.page || '**/*';
  const entries: { [key in string]: string | string[] } = {};
  const PAGES_ROOT = resolve(__dirname, './src/pages');
  let pathStringArray: string[] = [];

  if (pagePath?.includes('[')) {
    const baseString = pagePath.slice(0, pagePath.indexOf('['));
    const pageArray = pagePath.slice(pagePath.indexOf('[') + 1, pagePath.length - 1).split(',');
    for await (const page of pageArray) {
      const path = await glob(resolve(__dirname, `./src/pages/${baseString}${page}.html.tsx`));
      if (path.length === 0) {
        throw new Error(chalk.red(`src/pages/${baseString}${page}.html.tsx not found`));
      }
      pathStringArray = pathStringArray.concat(path);
    }
  } else {
    pathStringArray = await glob(resolve(__dirname, `./src/pages/${pagePath}.html.tsx`));
  }
  if (pathStringArray.length === 0) throw new Error(chalk.red(`src/pages/${pagePath}.html.tsx not found`));

  const buildPlugins = pathStringArray.map((filepath) => {
    const pageChunk = relative(PAGES_ROOT, filepath.replace(/\.html\.tsx$/, ''));
    const pageScriptPath = filepath.replace(/\.html\.tsx$/, '.ts');
    const pageScriptExists = existsSync(pageScriptPath);
    const pageStylePath = filepath.replace(/\.html\.tsx$/, '.scss');
    const pageStyleExists = existsSync(pageStylePath);
    if (pageScriptExists || pageStyleExists) {
      entries[pageChunk] = [
        ...(pageScriptExists ? [resolve(__dirname, pageScriptPath)] : []),
        ...(pageStyleExists ? [resolve(__dirname, pageStylePath)] : []),
      ];
    }

    return new HtmlWebpackPlugin({
      filename: relative(PAGES_ROOT, filepath).replace(/\.tsx$/, ''),
      template: composeRenderStaticQuery(filepath),
      inject: false,
      chunks: ['common', pageChunk],
      chunksSortMode: 'manual',
      minify: false,
    });
  });

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      common: [resolve(__dirname, './src/common.ts'), resolve(__dirname, './src/common.scss')],
      ...entries,
    },
    output: {
      path: resolve(__dirname, './dist'),
      filename: 'assets/js/[name].js',
      publicPath: '/',
    },
    resolve: {
      plugins: [new TsconfigPathsWebpackPlugin({ configFile: TSCONFIG_PATH })],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    watchOptions: {
      ignored: '/node_modules/',
    },
    plugins: [
      isProduction && new ForkTsCheckerWebpackPlugin({ typescript: { configFile: TSCONFIG_PATH } }),
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({ filename: 'assets/css/[name].css' }),
      ...buildPlugins,
      new PostHtmlPlugin(),
      ...(isProduction
        ? [
            new CopyPlugin({
              patterns: [
                // {
                //   from: '**/*',
                //   context: 'src/pages',
                //   to: resolve(__dirname, './dist'),
                //   globOptions: {
                //     ignore: ['**/*.tsx', '**/*.ts', '**/*.scss'],
                //   },
                // },
                {
                  from: '**/*',
                  context: 'src/assets/images',
                  to: resolve(__dirname, './dist/assets/images'),
                  globOptions: {
                    ignore: [],
                  },
                },
                // {
                //   from: '**/*',
                //   context: 'src/assets/fonts',
                //   to: resolve(__dirname, './dist/assets/fonts'),
                // },
              ],
            }),
            new ImageminPlugin({
              test: /\.(jpe?g|png|gif|svg)$/i,
              pngquant: {
                quality: '90-100',
              },
              gifsicle: {},
              svgo: {},
              plugins: [
                ImageminMozjpeg({
                  quality: 90,
                  progressive: true,
                }) as unknown as Promise<Buffer>,
              ],
            }),
          ]
        : []),
    ].filter((p) => p),
    module: {
      rules: [
        {
          test: /src(\/|\\)render-static\.tsx$/,
          resourceQuery: /\?filepath.+$/,
          use: (info: { resourceQuery: string }) => [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      targets: ['>0.25% in JP', 'not ie <= 10', 'ie 11'],
                      useBuiltIns: 'usage',
                      corejs: 3,
                    },
                  ],
                  [
                    '@babel/preset-react',
                    {
                      runtime: 'automatic',
                    },
                  ],
                  '@babel/preset-typescript',
                ],
                plugins: [
                  '@babel/plugin-syntax-dynamic-import',
                  ['@babel/plugin-proposal-class-properties', { loose: true }],
                  ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
                  ['@babel/plugin-proposal-private-methods', { loose: true }],
                ],
              },
            },
            {
              loader: 'string-replace-loader',
              options: {
                multiple: [
                  {
                    search: '__RENDER_STATIC_FILEPATH__',
                    replace: (new URLSearchParams(info.resourceQuery).get('filepath') as string).replace(
                      /[\\]/g,
                      '\\\\'
                    ),
                  },
                ],
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: /src(\/|\\)render-static\.tsx$/,
          use: [
            {
              loader: 'cache-loader',
            },
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
                  [
                    '@babel/preset-react',
                    {
                      runtime: 'automatic',
                    },
                  ],
                  '@babel/preset-typescript',
                ],
                plugins: ['@babel/plugin-syntax-dynamic-import'],
              },
            },
          ],
        },
        {
          test: /\.scss?$/,
          use: [
            ...(!isProduction
              ? [
                  {
                    loader: 'cache-loader',
                    options: { cacheDirectory: resolve(__dirname, '../node_modules/.cache/cache-loader-mpa') },
                  },
                ]
              : []),
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [autoprefixer({ grid: 'autoplace' }), cssnano(), objectfit()],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                sassOptions: {
                  importer: sassGlobImporter(),
                },
              },
            },
          ],
        },
      ],
    },
    devServer: {
      // host: '0.0.0.0',
      port: 8000,
      open: 'index.html',
      hot: true,
      static: {
        directory: resolve(__dirname, './src'),
        watch: true,
      },
      historyApiFallback: {},
      proxy: {},
    },
  };
};

export default createRegionConfig;
