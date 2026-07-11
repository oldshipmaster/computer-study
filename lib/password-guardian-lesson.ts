export function evaluatePassphrase(value: string) {
  const lower = value.toLowerCase(); const safeToPractice = !/(真实|我的密码)/.test(value);
  if (/123456|password|qwerty|abcdef/.test(lower)) return { strong: false, safeToPractice, feedback: "这是常见顺序，容易被猜到。换成多个无关的虚构词。" };
  if (/\d{7,}/.test(value) || /(?:电话|姓名|生日|学校|住址)/.test(value)) return { strong: false, safeToPractice: false, feedback: "不要把电话、生日、姓名等个人信息放进密码。" };
  const parts = value.split(/[-_\s]+/).filter(Boolean); const hasLetters = /[a-z]/i.test(value); const hasNumber = /\d/.test(value); const strong = value.length >= 20 && parts.length >= 4 && hasLetters && hasNumber;
  return { strong, safeToPractice, feedback: strong ? "这个虚构练习口令够长、词语多样。真实密码仍要独一无二并保密。" : "再加几个无关的虚构词和数字，让口令更长。" };
}
