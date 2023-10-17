const draw = (row) => {
  if (row % 2 === 0) {
    row++;
  }

  const mid = Math.floor(row / 2); // 2

  for (let i = 0; i < row; i++) {
    const spaces = Math.abs(mid - i); // 3
    const stars = row - 2 * spaces; // 5 - 2 * 3

    let rowText = " ".repeat(spaces) + "*".repeat(stars);

    console.log(rowText);
  }
};

draw(5);
