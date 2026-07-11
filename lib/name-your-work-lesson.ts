export interface NameValidation { valid: boolean; reason: string; }
export function validateFileName(name: string, existingNames: readonly string[]): NameValidation {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, reason: "先写一个能说明内容的名称。" };
  if (/[\\/:*?"<>|]/.test(trimmed)) return { valid: false, reason: "名称不能使用 / \\ : * ? 等特殊符号。" };
  if (/\d{7,}/.test(trimmed) || /(?:住址|电话|手机号|身份证)/.test(trimmed)) return { valid: false, reason: "名称里不要写姓名、电话或其他个人信息。" };
  if (!trimmed.toLowerCase().endsWith(".png")) return { valid: false, reason: "这是一张图片，请保留 .png 扩展名。" };
  if (existingNames.includes(trimmed)) return { valid: false, reason: "这个名称已经存在，换一个清楚的名称。" };
  return { valid: true, reason: "名称清楚，可以保存。" };
}
export function saveVirtualWork(name: string, location: string | null, existingNames: readonly string[]) {
  const validation = validateFileName(name, existingNames);
  if (!validation.valid) return { saved: false, fullPath: null, reason: validation.reason };
  if (!location) return { saved: false, fullPath: null, reason: "先选择保存位置。" };
  return { saved: true, fullPath: `${location}/${name.trim()}`, reason: "保存成功。" };
}
