import type { PropositionLabel, RelationType } from './types';

export const primaryLabels: Array<{ code: PropositionLabel; name: string; description: string }> = [
  { code: 'IS', name: '争议焦点', description: '案件中需要回答的争议问题' },
  { code: 'Non', name: '非论证成分', description: '不构成法律论证的文本成分' },
  { code: 'GM', name: '一般规范判断', description: '连接个案事实与裁判结论的规范基础' },
  { code: 'SM', name: '个别规范判断', description: '具体主体作出的法律意义评价' },
  { code: 'GF', name: '一般事实判断', description: '经验、背景或行业事实判断' },
  { code: 'SF', name: '个别事实判断', description: '本案对象和事件的事实判断' },
];

export const secondaryLabels: Record<'GM' | 'SM', Array<{ code: string; name: string }>> = {
  GM: [
    { code: 'GM-L', name: '法律条文' },
    { code: 'GM-I', name: '法律解释' },
    { code: 'GM-C', name: '合同及合同解释' },
    { code: 'GM-U', name: '习惯与行业惯例' },
    { code: 'GM-M', name: '道德与价值观念' },
    { code: 'GM-O', name: '其他规范判断' },
  ],
  SM: [{ code: 'SM-C', name: '合同及合同解释' }],
};

export const relationDefinitions: Array<{ code: RelationType; name: string; symbol: string; hint: string }> = [
  { code: 'S', name: '支持', symbol: '●', hint: '理由支持结论' },
  { code: 'A', name: '反对', symbol: '○', hint: '命题反对命题或关系' },
  { code: 'J', name: '组合', symbol: '+', hint: '缺一不可的合取结构' },
  { code: 'M', name: '匹配', symbol: '+', hint: '个别判断匹配一般判断' },
  { code: 'I', name: '同一', symbol: '/', hint: '多个命题语义相同' },
];
