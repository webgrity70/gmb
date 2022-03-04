/* eslint-disable no-restricted-globals */
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import urlRegex from 'url-regex';
import convertMeridiem from './convertMeridiem';

const isNumeric = (x) =>
  (typeof x === 'number' || typeof x === 'string') && !isNaN(Number(x));

export const minLength = (str, minLen) =>
  str.length < minLen
    ? `Please fill out the field. Min: ${minLen} characters`
    : null;

export const maxLength = (str, maxLen) =>
  str.length > maxLen ? `Out of range. Max: ${maxLen} characters` : null;

export const required = (field) => {
  if (typeof field === 'string' || typeof field === 'object') {
    return isEmpty(field) ? 'Required' : null;
  }
  return isNumeric(field) ? null : 'Required';
};

export const biggerThan = (value, minNum) => {
  if (Number(minNum) >= Number(value)) return 'Number should be bigger';
  return null;
};

export function validateTime({ date, time, day }) {
  if (date && time.hours && time.minutes && day !== null) {
    const hours = convertMeridiem({ hour: time.hours, format: time.format });
    const minutes = Number(time.minutes);
    const requestedDate = moment(new Date(date)).set({
      hours,
      minutes,
    });
    const today = moment();
    if (requestedDate.isBefore(today)) return 'Past Date';
    return null;
  }

  return null;
}

export function customPromptsValidation({ prompts, active }) {
  if (!active) return null;
  const promptsValidations = prompts.map((e) => required(e)).some((e) => e);
  const promptsErrors = !promptsValidations
    ? null
    : 'Please fill out the field.';
  return minLength(prompts, 1) || promptsErrors;
}

const isInsideRange = (numTest, num1, num2) => {
  const test = Number(numTest);
  const [minNum, maxNum] = [Number(num1), Number(num2)].sort((a, b) => a > b);
  return test >= minNum && test <= maxNum;
};

export const inRange = (amount, minBound, maxBound) =>
  isInsideRange(amount, minBound, maxBound) ? null : 'Out of range';

export const validateFormat = (time) => {
  const formats = ['am', 'pm'];
  if (Object.prototype.hasOwnProperty.call(time, 'format')) {
    const value = time.format ? time.format.toLowerCase() : null;
    return formats.includes(value) ? required(time.format) : 'Wrong Format';
  }
  return null;
};

export const url = (u) =>
  urlRegex({ exact: true, strict: true }).test(u)
    ? null
    : 'Please enter correct format: http://www.mywebsite.com';
