export const formatHhMm = (time) => {
  const hour = time.getHours();
  const minutes =
    time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  return `${hour}:${minutes}`;
};

export const defaultColorValue = (options, value) =>
  options
    ? options.find((option) => {
        return option.value === value;
      })
    : "";
