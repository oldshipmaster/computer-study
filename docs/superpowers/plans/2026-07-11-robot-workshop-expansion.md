# Robot Workshop Expansion Plan

**Goal:** Complete five game-based programming-foundation lessons for second-grade learners: sequence, coordinates, loops, conditions, and debugging.

**Shared design:** Every lesson separates a pure execution model from its visual robot simulator. Programs are small, visible, replayable, and deterministic. Children predict before running, watch one instruction at a time, explain outcomes, and fix programs without losing progress.

## Course 11: 指令排排队

- Arrange everyday and robot actions into an executable order.
- Compare two programs containing the same instructions in different orders.
- Challenge: guide a repair robot through wake, collect tool, repair bridge, and return.
- Badge: `sequence-engineer` / `顺序工程师`.

## Course 12: 方格城导航

- Read row/column coordinates, face directions, and calculate safe moves on a 6×6 grid.
- Challenge: visit three coordinates while avoiding blocked cells.
- Badge: `grid-navigator` / `方格导航员`.

## Course 13: 重复的力量

- Replace repeated instructions with fixed-count loops and compare instruction counts.
- Challenge: draw a square and collect four batteries using repeat blocks.
- Badge: `loop-builder` / `循环建造师`.

## Course 14: 如果下雨就撑伞

- Evaluate true/false conditions, choose branches, and understand that conditions are checked at run time.
- Challenge: equip a robot for changing weather and bridge signals.
- Badge: `condition-captain` / `条件判断员`.

## Course 15: 抓住小虫子

- Predict, run, observe, locate the first mismatch, change one thing, and retest.
- Challenge: repair three small programs containing order, loop-count, and condition bugs.
- Badge: `bug-catcher` / `调试侦探`.

## Quality gates

- Pure tests cover valid execution, invalid commands, boundaries, non-mutation, deterministic replay, and exact completion.
- Every essential action works with keyboard controls and has visible execution state.
- Errors are framed as evidence about the program, never as failure by the child.
- Full product tests, Pages build, lint, live deployment, and browser verification after each release batch.
