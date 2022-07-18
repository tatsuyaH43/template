type ClassNames = (string | string[] | false | undefined)[];

/**
 * htmlのclass名を区分ごとに分けた型
 */
type AllClass = {
  /** モディファイア */
  modifiers?: string | string[];
  /** ステート */
  states?: string | string[];
  /** ユーティリティ */
  utils?: string | string[];
  /** マルチクラス */
  add?: string | string[];
};

/**
 * modifire用のクラスを結合して返却します
 * @param modifiers modifierのclassNames
 * @return 先頭に-を付与したmodifire用のクラスの配列
 */
function mapModifiers(...modifiers: ClassNames): string[] {
  return modifiers
    .reduce<string[]>((acc, m) => (!m ? acc : [...acc, ...(typeof m === 'string' ? [m] : m)]), [])
    .map((modifier) => `-${modifier}`);
}

/**
 * state用のクラスを結合して返却します
 * @param states statesのclassNames
 * @return 先頭にis-を付与したstate用のクラスの配列
 */
function mapState(...states: ClassNames): string[] {
  return states
    .reduce<string[]>((acc, m) => (!m ? acc : [...acc, ...(typeof m === 'string' ? [m] : m)]), [])
    .map((state) => `is-${state}`);
}

/**
 * マルチクラスとして付与したいクラスを配列にして返却します。
 * @param adds マルチクラスのclassNames
 * @return マルチクラスのクラス用の文字列の配列
 */
function mapAdd(...adds: ClassNames): string[] {
  return adds
    .reduce<string[]>((acc, m) => (!m ? acc : [...acc, ...(typeof m === 'string' ? [m] : m)]), [])
    .map((add) => add);
}

/**
 * クラス名を結合するためのutil関数です。
 * ベースのクラス名にmodifier用, state用, util用, マルチクラス用のクラスを渡すとそれらを適切な形にし文字列として結合します
 *
 * @param baseClassName - ベースとなるクラス名
 * @param props -  ベースとなるクラス名
 * @return 全てのクラスを結合した文字列
 *
 * @example
 * ``` ts
 * const className={classNames('baseClassName', {
 *       modifiers: ['border', 'small'],
 *       states: 'active',
 *       utils: utilClassNames({ align: 'center' }),
 *       add: 'js-trigger1',
 *     })}
 * // `baseClassName -border -small is-active u-ai-center js-triggger`
 * ```
 *
 * Usage:
 *
 * ```tsx
 * const Component: React.FC = () => (
 *   <div
 *     className={classNames('baseClassName', {
 *       modifiers: ['border', 'small'],
 *       states: 'active',
 *       utils: utilClassNames({ align: 'center' }),
 *       add: 'js-trigger1',
 *     })}
 *   >
 *     Component
 *   </div>
 * );
 * ```
 */
export function classNames(baseClassName: string, props?: AllClass): string {
  if (!props) return baseClassName;
  const { modifiers, states, utils, add } = props;

  return [mapModifiers(modifiers), mapState(states), mapAdd(utils), mapAdd(add)]
    .flat()
    .reduce<string>((classNames, suffix) => (classNames += ` ${suffix}`), baseClassName);
}

// util classNames

/**
 * Utilクラス**margin**,**padding**に使用する値
 */
export type UtilSpaceValue = 'auto' | 0 | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 80;
/**
 * Utilクラス**margin-top**
 */
export type UtilSpaceMt = {
  /** `margin-top`用のutilクラス */
  mt?: UtilSpaceValue;
};
// /**
//  * Utilクラス**margin-bottom**に使用する値
//  */
// export type UtilSpaceMb = {
//   /** `margin-bottom`用のutilクラス */
//   mb?: UtilSpaceValue;
// };
/**
 * UtilクラスSP時**margin-top**
 */
export type UtilSpaceMtSp = {
  /** SPの`margin-top`用のutilクラス */
  mtsp?: UtilSpaceValue;
};

// /**
//  * Utilクラス**padding-top**に使用する値
//  */
// export type UtilSpacePt = {
//   /** `padding-top`用のutilクラス */
//   pt?: Exclude<UtilSpaceValue, 'auto'>;
// };
// /**
//  * Utilクラス**padding-right**に使用する値
//  */
// export type UtilSpacePr = {
//   /** `padding-right`用のutilクラス */
//   pr?: Exclude<UtilSpaceValue, 'auto'>;
// };
// /**
//  * Utilクラス**padding-bottom**に使用する値
//  */
// export type UtilSpacePb = {
//   /** `padding-bottom`用のutilクラス */
//   pb?: Exclude<UtilSpaceValue, 'auto'>;
// };
// /**
//  * Utilクラス**padding-left**に使用する値
//  */
// export type UtilSpacePl = {
//   /** `padding-left`用のutilクラス */
//   pl?: Exclude<UtilSpaceValue, 'auto'>;
// };

// /**
//  * UtilクラスSP時**padding-top**に使用する値
//  */
// export type UtilSpacePtSp = {
//   /** SP`padding-top`用のutilクラス */
//   ptsp?: Exclude<UtilSpaceValue, 'auto'>;
// };
// /**
//  * UtilクラスSP時**padding-right**に使用する値
//  */
// export type UtilSpacePrSp = {
//   /** SP`padding-right`用のutilクラス */
//   prsp?: Exclude<UtilSpaceValue, 'auto'>;
// };
// /**
//  * UtilクラスSP時**padding-bottom**に使用する値
//  */
// export type UtilSpacePbSp = {
//   /** SP`padding-bottom`用のutilクラス */
//   pbsp?: Exclude<UtilSpaceValue, 'auto'>;
// };
// /**
//  * UtilクラスSP時**padding-left**に使用する値
//  */
// export type UtilSpacePlSp = {
//   /** SP`padding-left`用のutilクラス */
//   plsp?: Exclude<UtilSpaceValue, 'auto'>;
// };
/**
 * UtilクラスSP時**padding-**に使用する値
 */
export type UtilSpace = UtilSpaceMt &
  // UtilSpaceMr &
  // UtilSpaceMb &
  // UtilSpaceMl &
  // UtilSpacePt &
  // UtilSpacePr &
  // UtilSpacePb &
  // UtilSpacePl &
  UtilSpaceMtSp;
// UtilSpaceMrSp &
// UtilSpaceMbSp &
// UtilSpaceMlSp &
// UtilSpacePtSp &
// UtilSpacePrSp &
// UtilSpacePbSp &
// UtilSpacePlSp;

/**
 * Utilクラス**display**
 */
export type UtilDisplayValue = 'pc' | 'sp' | 'all';

/**
 * Utilクラス**display**
 */
export type UtilDisplay = {
  dn?: UtilDisplayValue;
};

// text
/**
 * Utilクラス**text-align**に使用する値
 */
export type UtilTextAlignValue = 'left' | 'center' | 'right';
/**
 * Utilクラス**font-weight**に使用する値
 */
export type UtilTextWeightValue = 'bold' | 'normal' | 'bold-sp';
/**
 * Utilクラス**color**に使用する値
 */
export type UtilTextColorValue = 'black';
// | 'blue'
// | 'red'
// | 'orange'
// | 'darkorange'
// | 'middledarkorange'
// | 'lightgreen'
// | 'green'
// | 'darkgreen'
// | 'gray'
// | 'yellow';
/**
 * Utilクラス**font-size**に使用する値
 */
export type UtilTextSizeValue = 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28;
/**
 * Utilクラス**text-align**
 */
export type UtilTextAlign = {
  textalign?: UtilTextAlignValue;
};
/**
 * Utilクラス**font-weight**
 */
export type UtilTextWeight = {
  weight?: UtilTextWeightValue;
};
/**
 * Utilクラス**color**
 */
export type UtilTextColor = {
  color?: UtilTextColorValue;
};
/**
 * Utilクラス**color**
 */
export type UtilTextSize = {
  /** フォントサイズ */
  fontsize?: UtilTextSizeValue;
};

/**
 * Utilクラス**Text**
 */
export type UtilText = UtilTextAlign & UtilTextWeight & UtilTextColor & UtilTextSize;

/**
 * Utilクラス
 */
export type Util = UtilSpace & UtilDisplay & UtilText;
/**
 * Utilクラス用のprefix
 */
const utilClassPrefix = {
  /** text */
  color: 'text',
  weight: 'text',
  textalign: 'text',
  fontsize: 'text',
  /** display */
  dn: 'dn',
  /** margin */
  mt: 'mt',
  /** margin-sp */
  mtsp: 'mtsp',
  /** padding */
  // pt: 'pt',
  // pr: 'pr',
  // pb: 'pb',
  // pl: 'pl',
  // /** padding-sp */
  // ptsp: 'ptsp',
  // prsp: 'prsp',
  // pbsp: 'pbsp',
  // plsp: 'plsp',
} as const;

/**
 * Utilクラス用のclass名を結合して返却します
 * @param utils utilクラスのクラス用の文字列の配列
 */
export function utilClassNames(utils: Util): string[] {
  return Object.entries(utils).map(
    ([key, value]) => `u-${utilClassPrefix[key as keyof Util]}${typeof value !== 'boolean' ? `-${value}` : ''}`
  );
}

// memo
// 特定のtypeだけ抜きたい場合
// type UtilSpaceOnlyAlign = UtilAlign;
// type UtilSpaceExlude = Exclude<UtilSpaceValue, 0>;
// type UtilSpaceExtract = Extract<UtilSpaceValue, 0>;
// type UtilSpaceOmit = Omit<UtilSpace, 'mt'>;
// type UtilSpacePick = Pick<Util, 'mt'>;
