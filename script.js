// abhi yaha jo likhe hai isse html ka code fetch ho rha hai

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  // or kuch bhi karna chahiye
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

// strength ke sath wale button me color dalna
function setIndicator(color) {
  // indicator.computedStyleMap.backgroundColor = color;
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRanInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRanInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRanInteger(97, 123));
}

function generateUppercase() {
  return String.fromCharCode(getRanInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRanInteger(0, symbols.length);
  return symbols.charAt[randNum];
  //   return symbols.[randNum];
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected
  if (checkCount == 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  //let's start the journey to find new password
  //remove old passwd
  password = "";
  //lets put the stuff mentioned by checkboxes
  //   if (uppercaseCheck.checked) {
  //     password += generateUppercase();
  //   }
  //   if (lowercaseCheck.checked) {
  //     password += generatelowercase();
  //   }
  //   if (numbersCheck.checked) {
  //     password += generateRandomNumber();
  //   }
  //   if (symbolsCheck.checked) {
  //     password += generateSymbol();
  //   }

  let funcArr = [];
  if (uppercaseCheck.checked) funcArr.push(generateUppercase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRanInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //show in ui
  passwordDisplay.value = password;
  //calculate strength
  calcStrength();
});
