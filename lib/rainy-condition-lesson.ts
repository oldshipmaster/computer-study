export interface SafetyInputs { raining: boolean; bridgeOpen: boolean; }
export function evaluateCondition<T>(condition: boolean, whenTrue: T, whenFalse: T): T { return condition ? whenTrue : whenFalse; }
export function runSafetyProgram(inputs: SafetyInputs) { return { equipment: evaluateCondition(inputs.raining, "umbrella", "sunhat"), bridgeAction: evaluateCondition(inputs.bridgeOpen, "cross", "wait") }; }
