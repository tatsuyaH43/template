import { Helmet } from 'react-helmet';

export default function index() {
  return (
    <>
      <Helmet>
        <title>TEST_INDEX_TITLE</title>
        <link rel="canonical" href="[ページURL]" />
        <meta name="description" content="[デイスクリプション]" />
        <meta property="og:site_name" content="[サイトネーム]" />
        <meta property="og:title" content="[ページタイトル]" />
        <meta property="og:description" content="[ページ概要]" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="[ページURL]" />
        <meta property="og:image" content="[ページ画像]" />
        <meta property="fb:app_id" content="[app_id]" />
        <meta name="twitter:card" content="[カードタイプ summary or summary_large_image]" />
        <meta name="twitter:site" content="@[twitterユーザー名]" />
        <meta name="twitter:creator" content="@[twitterユーザー名]" />
      </Helmet>
      <p>test/index</p>
      <p style={{ minWidth: '1024px' }}>
        index.htmlテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト
        テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト
        テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト
        テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト
        テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト
      </p>
      <a href="/index.html">link</a>
    </>
  );
}
