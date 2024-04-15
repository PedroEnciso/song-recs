export const generateRandomNumber = (digits: number = 16) => {
  let randomNumber = "";
  for (let i = 0; i < digits; i++) {
    randomNumber += Math.floor(Math.random() * 10).toString();
  }
  return randomNumber;
};
