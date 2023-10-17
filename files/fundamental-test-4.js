const draw = (row) => {
  const mid = Math.ceil(row / 2); // 6
  const objLength = row * 2 - 1; // 21

  for (let i = 1; i <= row; i++) {
    let rowText = "";
    let spaceText = (mid - 1) * 2 - (Math.abs(6 - i) * 2 + 1); // 5
    let halfText = Math.abs(mid - i) + mid; // 21 - 5 / 2
    // [10, 9, 8, 7, 7, 8 , 9, 10];

    // 6 - 2 + 6 = 10;     abs(6 - 2) == 4 * 2 + 1 - 10 = 1
    // 6 - 3 + 6 = 9;      abs(6 - 3) == 3 * 2 + 1 - 10 = 3
    // 6 - 4 + 6 = 8;      abs(6 - 4) == 2 * 2 + 1 - 10 = 5
    // 6 - 5 + 6 = 7;      abs(6 - 5) == 1 * 2 + 1 - 10 = 7
    // 6 - 6 + 6 = 6;      abs(6 - 6) == 0 * 2 + 1 - 10 = 9
    // 6 - 7 + 6 = 7;      abs(6 - 7) == 1 * 2 + 1 - 10 = 7
    // 6 - 8 + 6 = 8;      abs(6 - 8) == 2 * 2 + 1 - 10 = 5
    // 6 - 9 + 6 = 9;      abs(6 - 9) == 3 * 2 + 1 - 10 = 3
    // 6 - 10 + 6) = 10;   abs(6 - 10) == 4 * 2 + 1 - 10 = 1

    if (i == 1 || i == row) {
      rowText = "*".repeat(objLength);
    } else if (i == mid) {
      rowText =
        "*".repeat(halfText - 1) +
        " " +
        "-".repeat(spaceText) +
        " " +
        "*".repeat(halfText - 1);
    } else {
      rowText =
        "*".repeat(halfText) + " ".repeat(spaceText) + "*".repeat(halfText);
    }

    console.log(rowText);
  }
};

draw(11);

// *********************
// ********** **********
// *********   *********
// ********     ********
// *******       *******
// ***** --------- *****
// *******       ******* <- 7
// ********     ********
// *********   *********
// ********** **********
// *********************

// 11 x 21
// row 11
// length 21
