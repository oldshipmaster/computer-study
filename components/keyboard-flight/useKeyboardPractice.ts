import { useCallback, useEffect, useRef, useState } from "react";
import { CHALLENGE } from "@/lib/flight-engine.mjs";
import {
  KEY_DEFINITIONS,
  START_DIRECTION,
  START_POSITION,
  getPracticeAction,
  isNewTutorialKey,
  nextPracticeKey,
  samePosition,
  type Direction,
  type KeyDefinition,
  type Position,
} from "@/components/keyboard-flight/lesson-model";

interface KeyboardPracticeOptions {
  announce: (caption: string, withSpeech?: boolean) => void;
  hintLevel: number;
  markUserGesture: () => void;
  registerUsefulInput: () => void;
}

export function useKeyboardPractice({
  announce,
  hintLevel,
  markUserGesture,
  registerUsefulInput,
}: KeyboardPracticeOptions) {
  const [activeKey, setActiveKey] = useState<KeyDefinition["key"] | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(() => new Set());
  const [practicePosition, setPracticePosition] = useState<Position>(START_POSITION);
  const [practiceDirection, setPracticeDirection] = useState<Direction>(START_DIRECTION);
  const [practiceCollected, setPracticeCollected] = useState(false);
  const practicePositionRef = useRef<Position>(START_POSITION);
  const keyFlashTimerRef = useRef<number | null>(null);

  const flashKey = useCallback((key: KeyDefinition["key"]) => {
    setActiveKey(key);
    if (keyFlashTimerRef.current !== null) {
      window.clearTimeout(keyFlashTimerRef.current);
    }
    keyFlashTimerRef.current = window.setTimeout(() => setActiveKey(null), 240);
  }, []);

  useEffect(
    () => () => {
      if (keyFlashTimerRef.current !== null) {
        window.clearTimeout(keyFlashTimerRef.current);
      }
    },
    [],
  );

  const handleTutorialKey = useCallback(
    (key: KeyDefinition["key"]) => {
      markUserGesture();
      flashKey(key);

      if (!isNewTutorialKey(pressedKeys, key)) {
        announce("这个按键已经点亮了，再找一个还没亮的按键。", true);
        return;
      }

      const nextPressedKeys = new Set(pressedKeys);
      nextPressedKeys.add(key);
      registerUsefulInput();
      setPressedKeys(nextPressedKeys);

      if (nextPressedKeys.size === KEY_DEFINITIONS.length) {
        announce("五个按键全部点亮！飞船控制台恢复了。", true);
      } else {
        announce(`很好！还差 ${KEY_DEFINITIONS.length - nextPressedKeys.size} 个按键。`, true);
      }
    },
    [announce, flashKey, markUserGesture, pressedKeys, registerUsefulInput],
  );

  const handlePracticeKey = useCallback(
    (key: KeyDefinition["key"]) => {
      markUserGesture();
      flashKey(key);

      if (practiceCollected) {
        announce("能量星已经收好啦，去看看怎样排列指令吧。", true);
        return;
      }

      const action = getPracticeAction(practicePositionRef.current, key);

      if (key === " ") {
        if (action.collected) {
          registerUsefulInput();
          setPracticeCollected(true);
          announce("收集成功！方向键负责移动，空格键负责行动。", true);
        } else {
          announce("还没到能量星旁边，先用方向键靠近它。", true);
        }
        return;
      }

      if (action.direction) {
        setPracticeDirection(action.direction);
      }

      if (!action.progressed) {
        announce("这边走不通，换一个方向就好。", true);
        return;
      }

      practicePositionRef.current = action.position;
      registerUsefulInput();
      setPracticePosition(action.position);
      announce(
        samePosition(action.position, CHALLENGE.star)
          ? "到达能量星了！现在按空格键收集。"
          : "飞船移动成功，继续靠近能量星。",
        true,
      );
    },
    [
      announce,
      flashKey,
      markUserGesture,
      practiceCollected,
      registerUsefulInput,
    ],
  );

  const nextTutorialKey =
    KEY_DEFINITIONS.find((definition) => !pressedKeys.has(definition.key))?.key ?? null;
  const practiceHintKey = practiceCollected ? null : nextPracticeKey(practicePosition);

  return {
    activeKey,
    handlePracticeKey,
    handleTutorialKey,
    nextTutorialKey: hintLevel > 0 ? nextTutorialKey : null,
    practiceCollected,
    practiceDirection,
    practiceHintKey: hintLevel > 0 ? practiceHintKey : null,
    practicePosition,
    pressedKeys,
  };
}
