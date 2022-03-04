const map24 = {
  12: 12,
  '01': 13,
  '02': 14,
  '03': 15,
  '04': 16,
  '05': 17,
  '06': 18,
  '07': 19,
  '08': 20,
  '09': 21,
  10: 22,
  11: 23,
};

export function isValid(timeString) {
  const time = timeString.trim().match(/(\d+)(?::(\d\d))?\s*(a|p)?/i);
  const time24hr = timeString.trim().match(/(\d\d)[:.]?(\d\d)/);
  const num = timeString.replace(/[^0-9]/g, '');

  if (!time && !time24hr) return false;
  if (time && !time[1]) return false;
  if (num.length > 4) return false;
  return true;
}

export function removeSpacer(time) {
  return time.replace(/[:.]/, '');
}

export function formatSemi24(time) {
  if (time.length === 1) return `0${time}00`;
  if (time.length === 2) return `${time}00`;
  if (time.length === 3) return `0${time}`;
  return time;
}

export function checkHour(hour, meridiem) {
  if (hour > '24') return null;
  if (hour === '12' && meridiem === 'a') return '00';
  if (hour < '12' && meridiem === 'p') return map24[hour];
  return hour;
}

export function checkMinute(minute) {
  if (minute > '59') return null;
  return minute;
}

export function convertTo24hrTime(time) {
  const timeArray = time.split(/(p|a)/);
  const meridiem = timeArray[1];

  const semi24 = formatSemi24(timeArray[0]);
  const hour = checkHour(semi24.substring(0, 2), meridiem);
  const minute = checkMinute(semi24.substring(2, 4));

  if (!hour || !minute) return null;
  return {
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
  };
}

export function assignToDate(time) {
  const dateTime = new Date();
  dateTime.setHours(time.hour);
  dateTime.setMinutes(time.minute);
  dateTime.setSeconds(0, 0);
  return dateTime;
}

export default function (time) {
  if (!time || !isValid(time.toString())) return 'Invalid Time';
  const time1 = removeSpacer(time.toString());
  const time2 = convertTo24hrTime(time1);
  if (!time2) return 'Invalid Time';
  return assignToDate(time2);
}