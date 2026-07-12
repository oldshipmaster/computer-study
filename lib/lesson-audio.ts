export interface LessonSpeechCheck { enabled: boolean; hidden: boolean; hasApi: boolean; message: string; }
export function shouldSpeakLesson(check: LessonSpeechCheck): boolean {
  return check.enabled && !check.hidden && check.hasApi && check.message.trim().length > 0;
}

export function safelyRunSpeech(action: () => void): boolean {
  try {
    action();
    return true;
  } catch {
    return false;
  }
}
