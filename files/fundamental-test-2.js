const draw = (row) => {
  for (let i = 0; i <= row - 1; i++) {
    let s = "*";
    for (let j = 0; j <= i; j++) {
      if (i == j) {
        console.log(s);
        return s;
      } else {
        s = s + "*";
      }
    }
  }
};

draw(5);
