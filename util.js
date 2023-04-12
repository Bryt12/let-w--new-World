function getMaxVal() {
  // Loop through keyState object
  // Return the key with the highest value
  let maxKey = '';
  let maxVal = -1;
  for (let key in keyState) {
    if (keyState[key] > maxVal) {
      maxKey = key;
      maxVal = keyState[key];
    }
  }

  return maxVal;
}

function rc() {
  return color(random(255), random(255), random(255));
}
