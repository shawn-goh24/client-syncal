/**
 * Functions that converts JS date into HH:MM string format
 * @param {new Date()} time
 * @returns {string}
 */
const formatHhMm = (time) => {
  try {
    const hour = time.getHours();
    const minutes =
      time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
    return `${hour}:${minutes}`;
  } catch (err) {
    return err;
  }
};

/**
 * Function which returns color if its inside the color options
 * @param {array} options
 * @param {string} value
 * @returns {object}
 */
const defaultColorValue = (options, value) =>
  options
    ? options.find((option) => {
        return option.value === value;
      })
    : "";

module.exports = {
  formatHhMm,
  defaultColorValue,
};
