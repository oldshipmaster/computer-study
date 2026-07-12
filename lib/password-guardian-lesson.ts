export interface PassphraseChecks {
  longEnough: boolean;
  enoughParts: boolean;
  hasLetters: boolean;
  hasNumber: boolean;
  avoidsCommonPattern: boolean;
  avoidsPersonalInfo: boolean;
}

export function evaluatePassphrase(value: string) {
  const lower = value.toLowerCase();
  const parts = value.split(/[-_\s]+/).filter(Boolean);
  const hasCommonPattern = /123456|password|qwerty|abcdef/.test(lower);
  const hasPersonalInfo = /\d{7,}/.test(value) || /(?:电话|姓名|生日|学校|住址)/.test(value);
  const checks: PassphraseChecks = {
    longEnough: value.length >= 20,
    enoughParts: parts.length >= 4,
    hasLetters: /[a-z]/i.test(value),
    hasNumber: /\d/.test(value),
    avoidsCommonPattern: !hasCommonPattern,
    avoidsPersonalInfo: !hasPersonalInfo,
  };
  const safeToPractice = !/(真实|我的密码)/.test(value) && !hasPersonalInfo;
  const strong = Object.values(checks).every(Boolean);

  if (hasCommonPattern) return { strong: false, safeToPractice, checks, feedback: "这是常见顺序，容易被猜到。换成多个无关的虚构词。" };
  if (hasPersonalInfo) return { strong: false, safeToPractice: false, checks, feedback: "不要把电话、生日、姓名等个人信息放进密码。" };
  return {
    strong,
    safeToPractice,
    checks,
    feedback: strong ? "这个虚构练习口令够长、词语多样。真实密码仍要独一无二并保密。" : "再加几个无关的虚构词和数字，让口令更长。",
  };
}
