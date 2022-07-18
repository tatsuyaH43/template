import React from 'react';
import Html from 'html';
import { renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';
// import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Page from '__RENDER_STATIC_FILEPATH__';

function renderStatic(params: HtmlWebpackPlugin.TemplateParameter) {
  const app = renderToStaticMarkup(<Page />);
  const helmet = Helmet.renderStatic();

  const scripts = params.htmlWebpackPlugin.files.js.map((filepath, idx) => {
    // const attrs = {
    // defer: /common(\..+)?\.js$/.test(filepath),
    // };

    return <script key={idx} defer src={filepath} /*{...attrs}*/ />;
  });

  const styles = params.htmlWebpackPlugin.files.css.map((filepath, idx) => {
    const attrs = {
      rel: 'stylesheet',
      type: 'text/css',
    };

    return <link key={idx} href={filepath} {...attrs} />;
  });

  const htmlComponent = (
    <Html
      body={app}
      titleComponents={helmet.title.toComponent()}
      htmlAttributes={helmet.htmlAttributes.toComponent() as React.HTMLAttributes<HTMLElement>}
      headComponents={[
        helmet.link.toComponent(),
        helmet.meta.toComponent(),
        helmet.noscript.toComponent(),
        styles,
        helmet.style.toComponent(),
        scripts,
        helmet.script.toComponent(),
        helmet.base.toComponent(),
      ]}
      bodyAttributes={helmet.bodyAttributes.toComponent()}
    />
  );
  const html = `<!doctype html>${renderToStaticMarkup(htmlComponent)}`
    .replace(/ data-react-helmet="true"/g, '')
    .replace(/<pre class="a-comment">([\s\S]*?)<\/pre>/gm, '<!-- $1 -->');

  return html;
}

export default renderStatic;
