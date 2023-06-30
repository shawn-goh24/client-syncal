export const formatHhMm = (time) => {
  // console.log(time);
  const hour = time.getHours();
  const minutes =
    time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  return `${hour}:${minutes}`;
};
