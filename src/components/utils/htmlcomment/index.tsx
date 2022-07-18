import React from 'react';
import { classNames } from 'lib/component';

export type Props = {
  /** コメント用テキスト */
  text: string;
};

/**
 * HTMLコメント用のコンポーネントです。
 * ビルド時後htmlコメントに変換します。
 */
export const HTMLComment: React.FC<Props> = (props) => {
  return <pre className={classNames('a-comment', {})} dangerouslySetInnerHTML={{ __html: props.text }}></pre>;
};
