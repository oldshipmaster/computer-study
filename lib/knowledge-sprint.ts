import { REVIEW_QUESTIONS, REVIEW_REQUIREMENTS } from "./review-challenge.ts";
import { TERM_MATCH_QUESTIONS } from "./term-match.ts";

export type KnowledgeSprintQuestionKind = "concept" | "scenario";
export type KnowledgeSprintPhase = "answering" | "feedback" | "complete";

export interface KnowledgeSprintQuestion {
  id: string;
  kind: KnowledgeSprintQuestionKind;
  courseId: string;
  prompt: string;
  options: [string, string, string];
  answer: string;
  explanation: string;
}

export interface KnowledgeSprintState {
  index: number;
  phase: KnowledgeSprintPhase;
  questionCount: number;
  score: number;
  lastAward: number;
  correct: number;
  streak: number;
  bestStreak: number;
  shields: number;
  feedback: { kind: "idle" | "correct" | "miss"; message: string };
  missedCourseIds: string[];
}

function normalizeInteger(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

function rotate<T>(items: readonly T[], rotation: number) {
  if (items.length === 0) return [];
  const safeRotation = Number.isFinite(rotation) ? Math.trunc(rotation) : 0;
  const offset = ((safeRotation % items.length) + items.length) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

export function knowledgeSprintOptionIndex(key: string): number | null {
  const optionIndex = ["a", "b", "c"].indexOf(key.toLocaleLowerCase());
  return optionIndex >= 0 ? optionIndex : null;
}

function conceptQuestions(completed: ReadonlySet<string>): KnowledgeSprintQuestion[] {
  return TERM_MATCH_QUESTIONS
    .filter((question) => completed.has(question.courseId))
    .map((question) => ({
      id: `sprint-concept-${question.id}`,
      kind: "concept" as const,
      courseId: question.courseId,
      prompt: question.prompt,
      options: [...question.options] as [string, string, string],
      answer: question.answer,
      explanation: `${question.answer}：${question.example}`,
    }));
}

function scenarioQuestions(completed: ReadonlySet<string>): KnowledgeSprintQuestion[] {
  return REVIEW_QUESTIONS
    .filter((question) => completed.has(REVIEW_REQUIREMENTS[question.id]))
    .map((question) => ({
      id: `sprint-scenario-${question.id}`,
      kind: "scenario" as const,
      courseId: REVIEW_REQUIREMENTS[question.id],
      prompt: question.prompt,
      options: [...question.options] as [string, string, string],
      answer: question.answer,
      explanation: question.explanation,
    }));
}

export function buildKnowledgeSprintDeck(
  completedCourseIds: readonly string[],
  rotation = 0,
  limit = 5,
): KnowledgeSprintQuestion[] {
  const completed = new Set(completedCourseIds);
  const concepts = rotate(conceptQuestions(completed), rotation);
  const scenarios = rotate(scenarioQuestions(completed), rotation);
  const targetLength = normalizeInteger(limit, 0, 5);
  const deck: KnowledgeSprintQuestion[] = [];
  let conceptIndex = 0;
  let scenarioIndex = 0;

  while (deck.length < targetLength) {
    const preferConcept = deck.length % 2 === 0;
    const preferred = preferConcept ? concepts[conceptIndex] : scenarios[scenarioIndex];
    const fallback = preferConcept ? scenarios[scenarioIndex] : concepts[conceptIndex];
    const next = preferred ?? fallback;
    if (!next) break;

    deck.push(next);
    if (next.kind === "concept") conceptIndex += 1;
    else scenarioIndex += 1;
  }

  return deck;
}

export function createKnowledgeSprintState(questionCount: number): KnowledgeSprintState {
  const safeQuestionCount = normalizeInteger(questionCount, 0, 5);
  return {
    index: 0,
    phase: safeQuestionCount > 0 ? "answering" : "complete",
    questionCount: safeQuestionCount,
    score: 0,
    lastAward: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    shields: 3,
    feedback: { kind: "idle", message: "选出最有道理的答案。" },
    missedCourseIds: [],
  };
}

export function answerKnowledgeSprint(
  state: KnowledgeSprintState,
  optionIndex: number,
  deck: readonly KnowledgeSprintQuestion[],
  activationDetail = 1,
): KnowledgeSprintState {
  if (state.phase !== "answering" || activationDetail > 1 || !Number.isInteger(optionIndex)) return state;
  const question = deck[state.index];
  const selected = question?.options[optionIndex];
  if (!question || selected === undefined) return state;

  if (selected === question.answer) {
    const nextStreak = state.streak + 1;
    const award = 100 + state.streak * 25;
    return {
      ...state,
      phase: "feedback",
      score: state.score + award,
      lastAward: award,
      correct: state.correct + 1,
      streak: nextStreak,
      bestStreak: Math.max(state.bestStreak, nextStreak),
      feedback: { kind: "correct", message: `答对了！${question.explanation}` },
    };
  }

  return {
    ...state,
    phase: "feedback",
    streak: 0,
    lastAward: 0,
    shields: Math.max(0, state.shields - 1),
    feedback: { kind: "miss", message: `这一题没有答对。${question.explanation}` },
    missedCourseIds: state.missedCourseIds.includes(question.courseId)
      ? state.missedCourseIds
      : [...state.missedCourseIds, question.courseId],
  };
}

export function advanceKnowledgeSprint(
  state: KnowledgeSprintState,
  deck: readonly KnowledgeSprintQuestion[],
  activationDetail = 1,
): KnowledgeSprintState {
  if (state.phase !== "feedback" || activationDetail > 1) return state;
  if (state.index >= deck.length - 1) return { ...state, phase: "complete" };
  return {
    ...state,
    index: state.index + 1,
    phase: "answering",
    lastAward: 0,
    feedback: { kind: "idle", message: "选出最有道理的答案。" },
  };
}
