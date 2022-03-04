import Helpers from '../Utils/Helpers';

export const options = [
  { label: 'Reminders:', subLabel: '(before the activity)', key: 'intention' },
  { label: 'Check-ins:', subLabel: '(after the activity)', key: 'checkin' },
];

export function getReminderVal(value) {
  return [
    [
      {
        key: 'intention',
        options: [{ key: 'reminder', value }],
      },
    ],
  ];
}

export function getFormatedReminder(reminder) {
  const val = reminder * 60;
  const fixedValue = val === 0 ? 10 : val;
  const { h, m } = Helpers.reminderMinuteToDisplayConversion(fixedValue);
  const hoursDisplay = h > 0 ? `${h} ${h === 1 ? 'hour' : 'hours'} ` : '';
  const minutesDisplay = m > 0 ? `${m} ${m === 1 ? 'minute' : 'minutes'} ` : '';
  return `${hoursDisplay}${minutesDisplay} before each event`;
}
