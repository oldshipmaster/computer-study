import { DICTIONARY_ENTRIES } from "./computer-dictionary.ts";
import { RECOMMENDED_ROUTE_IDS } from "./course-data.ts";

export interface TermMatchQuestion {
  id: string;
  courseId: string;
  islandId: string;
  prompt: string;
  options: [string, string, string];
  answer: string;
  example: string;
}

const ENTRY_BY_COURSE = new Map(DICTIONARY_ENTRIES.map((entry) => [entry.courseId, entry]));

export const TERM_MATCH_QUESTIONS: readonly TermMatchQuestion[] = RECOMMENDED_ROUTE_IDS.map((courseId, index) => {
  const entry = ENTRY_BY_COURSE.get(courseId);
  if (!entry) throw new Error(`Missing dictionary entry for ${courseId}`);
  const islandEntries = DICTIONARY_ENTRIES.filter((candidate) => candidate.islandId === entry.islandId);
  const position = islandEntries.findIndex((candidate) => candidate.id === entry.id);
  const terms = [entry.term, islandEntries[(position + 1) % islandEntries.length].term, islandEntries[(position + 2) % islandEntries.length].term];
  const rotation = index % terms.length;
  const options = [...terms.slice(rotation), ...terms.slice(0, rotation)] as [string, string, string];
  return { id: `term-${entry.id}`, courseId: entry.courseId, islandId: entry.islandId, prompt: entry.explanation, options, answer: entry.term, example: entry.example };
});

export function getUnlockedTermQuestions(completedCourseIds: readonly string[]): TermMatchQuestion[] {
  const completed = new Set(completedCourseIds);
  return TERM_MATCH_QUESTIONS.filter((question) => completed.has(question.courseId));
}

export interface TermMatchState { index: number; correct: number; completed: boolean; feedback: string; }
export function createTermMatchState(): TermMatchState {
  return { index: 0, correct: 0, completed: false, feedback: "读解释，再选择最合适的电脑词语。" };
}

export function answerTermMatch(state: TermMatchState, optionIndex: number, questions: readonly TermMatchQuestion[], activationDetail = 1): TermMatchState {
  if (state.completed || questions.length === 0 || activationDetail > 1) return state;
  const question = questions[state.index];
  if (!question || question.options[optionIndex] !== question.answer) return { ...state, feedback: `再想一想。线索例子：${question?.example ?? "先完成一课解锁题目。"}` };
  const last = state.index === questions.length - 1;
  return { index: last ? state.index : state.index + 1, correct: state.correct + 1, completed: last, feedback: last ? "本次解锁的概念全部配对成功！" : `答对了：${question.answer}。继续下一题。` };
}
