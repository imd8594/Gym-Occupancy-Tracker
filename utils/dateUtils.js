/**
 * Filename: dateUtils.js
 * Date: 12/16/2020
 * Author: Ian Dansereau
 * 
 * Date functions
 */

const daysOfWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
}

const getDayOfWeek = () => {
  const day = daysOfWeek[new Date().getDay()];
  return day;
}

module.exports = {
  getDayOfWeek,
}
