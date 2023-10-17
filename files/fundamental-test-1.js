const createFibonacci = (max, arr = [], num = 1) => {
  let next = 1;
  if (max <= num) {
    console.log(arr);
    return arr.join(" ");
  } else {
    if (arr.length > 1) {
      next = arr[arr.length - 2] + num;
    }

    arr.push(next);
    createFibonacci(max, arr, next);
  }
};

createFibonacci(35);
