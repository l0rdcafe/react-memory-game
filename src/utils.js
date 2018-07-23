export const colors = {
  available: "#eee",
  challenge: "deepskyblue",
  correct: "lightgreen",
  wrong: "lightcoral"
};

export const diff = (arr1, arr2) => arr1.filter(n => !arr2.includes(n));
