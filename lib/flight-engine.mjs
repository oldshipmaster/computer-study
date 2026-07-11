export const DIRECTIONS = Object.freeze(["north", "east", "south", "west"]);

export const KEY_TUTORIAL = [
  { key: "ArrowUp", label: "↑", direction: "north" },
  { key: "ArrowRight", label: "→", direction: "east" },
  { key: "ArrowDown", label: "↓", direction: "south" },
  { key: "ArrowLeft", label: "←", direction: "west" },
  { key: " ", label: "空格键", action: "collect" },
];

export const CHALLENGE = {
  width: 5,
  height: 4,
  start: { x: 0, y: 2 },
  startDirection: "east",
  asteroids: [{ x: 3, y: 2 }],
  star: { x: 2, y: 1 },
};

const DIRECTION_DELTAS = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

function samePosition(first, second) {
  return first.x === second.x && first.y === second.y;
}

function turn(direction, amount) {
  const currentIndex = DIRECTIONS.indexOf(direction);
  const nextIndex = (currentIndex + amount + DIRECTIONS.length) % DIRECTIONS.length;
  return DIRECTIONS[nextIndex];
}

export function moveShip(position, direction, grid) {
  const delta = DIRECTION_DELTAS[direction];
  const nextPosition = {
    x: position.x + delta.x,
    y: position.y + delta.y,
  };
  const outsideGrid = nextPosition.x < 0
    || nextPosition.x >= grid.width
    || nextPosition.y < 0
    || nextPosition.y >= grid.height;
  const hitAsteroid = grid.asteroids.some((asteroid) => samePosition(nextPosition, asteroid));

  if (outsideGrid || hitAsteroid) {
    return {
      position: { ...position },
      crashed: true,
    };
  }

  return {
    position: nextPosition,
    crashed: false,
  };
}

export function runProgram(program, challenge) {
  let position = { ...challenge.start };
  let direction = challenge.startDirection;
  let crashed = false;
  let collected = false;
  const steps = [];

  for (const instruction of program) {
    if (instruction === "forward") {
      const movement = moveShip(position, direction, challenge);
      position = movement.position;
      crashed = movement.crashed;
    } else if (instruction === "left") {
      direction = turn(direction, -1);
    } else if (instruction === "right") {
      direction = turn(direction, 1);
    } else if (instruction === "collect") {
      collected ||= samePosition(position, challenge.star);
    }

    steps.push({
      instruction,
      position: { ...position },
      direction,
      crashed,
      collected,
    });

    if (crashed) {
      break;
    }
  }

  return {
    success: collected && !crashed,
    crashed,
    collected,
    finalPosition: { ...position },
    finalDirection: direction,
    steps,
  };
}
