function dateToDDMMYY(date) {
  var d = date.getDate();
  var m = date.getMonth() + 1;
  var y = date.getFullYear();
  return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
}

function getDaysBetweenDates(d0, d1) {
  var msPerDay = 8.64e7;

  // Copy dates so don't mess them up
  var x0 = new Date(d0);
  var x1 = new Date(d1);

  // Set to noon - avoid DST errors
  x0.setHours(12, 0, 0);
  x1.setHours(12, 0, 0);

  // Round to remove daylight saving errors
  return Math.round((x1 - x0) / msPerDay);
}

module.exports = {
  dateToDDMMYY,
  getDaysBetweenDates
};
