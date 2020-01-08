function cleanStringWithSpaces(string) {
  let returnString = string.replace(/\s+/g, '_').toLowerCase();
  returnString = returnString.replace('_&', '');
  return returnString;
}

module.exports = {
  cleanStringWithSpaces
};
