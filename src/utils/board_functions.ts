import { Korki, ExtendedKorki } from "../types/korki";
const getDisDir = (firstType: ExtendedKorki, newType: ExtendedKorki) => {
  let dis = 0;
  let dir = "none";
  if (newType.x + newType.y === firstType.x + firstType.y) {
    dir = firstType.x > newType.x ? "upRight" : "downLeft";
    dis = Math.abs(firstType.x - newType.x);
  } else if (firstType.x - newType.x === firstType.y - newType.y) {
    dir = firstType.x > newType.x ? "upLeft" : "downRight";
    dis = Math.abs(firstType.x - newType.x);
  }
  return { dir, dis };
};

const checkEatable = (
  firstType: ExtendedKorki,
  newType: ExtendedKorki,
  korkiState: Korki[]
) => {
  let movable = false;
  let backWard = false;
  let nigus = false;
  let eat = -1;

  const { dir, dis } = getDisDir(firstType, newType);
  if (dir === "none" || newType.type !== 3) {
    return { movable, eat, nigus };
  }

  const diagId = moveableDirection(firstType.x, firstType.y, dir).splice(
    0,
    dis
  );

  // nigus moves
  if (firstType.nigus) {
    return findOtherTypeKorkiId(diagId, firstType.type, korkiState);
  }

  const { varBackWard, varMovable, varEat } = checkBackMove(
    firstType,
    diagId,
    korkiState,
    dir
  );
  backWard = varBackWard;
  movable = varMovable;
  eat = varEat;

  //forward movement and check nigus
  if (!backWard && diagId.length < 3) {
    if (diagId.length === 2) {
      if (
        korkiState[diagId[0]].type !== firstType.type &&
        korkiState[diagId[0]].type !== 3
      ) {
        eat = korkiState[diagId[1]].type === 3 ? diagId[0] : -1;
        movable = eat === -1 ? false : true;
      } else {
        movable = false;
      }
    } else if (diagId.length === 1) {
      movable = korkiState[diagId[0]].type === 3 && firstType.selected !== 2;
    }
    nigus =
      (firstType.type === 1 && newType.x === 7) ||
      (firstType.type === 2 && newType.x === 0)
        ? true
        : false; // firstType.nigus === true ? true :
  }

  return { movable, eat, nigus };
};
const checkBackMove = (
  firstType: ExtendedKorki,
  diagId: number[],
  korkiState: Korki[],
  dir: string
) => {
  let varBackWard = true;
  let varMovable = false;
  let varEat = -1;
  const direction = firstType.type === 1 ? "up" : "down";
  const opostion = firstType.type === 1 ? 2 : 1;

  if (dir.startsWith(direction)) {
    if (diagId.length === 2) {
      varEat =
        korkiState[diagId[0]].type === opostion &&
        korkiState[diagId[1]].type === 3
          ? diagId[0]
          : -1;
      varMovable = varEat === -1 ? false : true;
    }
  } else {
    varBackWard = false;
  }
  return { varBackWard, varMovable, varEat };
};
//nigus move check
const findOtherTypeKorkiId = (
  diagId: number[],
  myType: number,
  korkiState: Korki[]
) => {
  let eat = -1;
  let typeTwoCount = 0;
  let movable = true;

  diagId.forEach((id) => {
    const korki = korkiState[id];
    if (korki.type !== myType || korki.type === 3) {
      if (korki.type !== 3) {
        if (typeTwoCount === 0) {
          eat = id;
          typeTwoCount++;
        } else {
          movable = false;
        }
      }
    } else {
      movable = false;
    }
  });

  return { movable, eat, nigus: true };
};

function moveableDirection(x: number, y: number, dir: string) {
  let newX = x;
  let newY = y;
  const diagId = [];
  while (
    (dir === "downLeft" && newX !== 7 && newY !== 0) ||
    (dir === "downRight" && newX !== 7 && newY !== 7) ||
    (dir === "upRight" && newX !== 0 && newY !== 7) ||
    (dir === "upLeft" && newX !== 0 && newY !== 0)
  ) {
    if (dir === "downLeft") {
      newX++;
      newY--;
    } else if (dir === "downRight") {
      newX++;
      newY++;
    } else if (dir === "upRight") {
      newX--;
      newY++;
    } else if (dir === "upLeft") {
      newX--;
      newY--;
    }

    diagId.push(getIdFromRowColumn(`${newX}${newY}`));
  }
  return diagId;
}

const getIdFromRowColumn = (customKey: string): number => {
  const row = Number(customKey[0]);
  const col = Number(customKey[1]);
  if (row >= 0 && row < 8 && col >= 0 && col < 8 && (row + col) % 2 === 0) {
    const id = Math.floor((row * 8 + col) / 2);
    return id;
  }
  return -1; // Return undefined for invalid row or column or if the condition doesn't match
};

export { checkEatable };
