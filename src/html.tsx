import React from 'react';

interface Props {
  htmlAttributes?: React.HTMLAttributes<HTMLElement>;
  titleComponents?: React.ReactNode;
  headComponents?: React.ReactNode;
  bodyAttributes?: React.HTMLAttributes<HTMLBodyElement>;
  body: string;
}

const Html: React.FC<Props> = (props) => (
  <html lang="ja" {...props.htmlAttributes}>
    <head>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      {props.titleComponents}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="shortcut icon" href="/favicon.ico" />
      {props.headComponents}
    </head>
    <body {...props.bodyAttributes} dangerouslySetInnerHTML={{ __html: props.body }} />
  </html>
);

export default Html;
