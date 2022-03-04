export default ({ hour, format }) => {
  if (format && format.toLowerCase() === 'am' && Number(hour) >= 12) {
    return Number(hour) - 12;
  }
  if (format && format.toLowerCase() === 'pm' && Number(hour) < 12) {
    return Number(hour) + 12;
  }
  return hour;
};
