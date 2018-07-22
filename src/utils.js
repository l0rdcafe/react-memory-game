export const sampleSize = (arr, n) => {
  const result = [];

  for (let i = 0; i < Math.floor(Math.random() * arr.length || n) + 1; i += 1) {
    result.push(Math.floor(Math.random() * arr.length));
  }
  return result;
}

export const colors = {
  available: "#eee",
  challenge: "deepskyblue",
  correct: "lightgreen",
  wrong: "lightcoral"
};

export const diff = (arr1, arr2) => arr1.filter(n => !arr2.includes(n));
