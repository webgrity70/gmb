import { toast } from 'react-toastify';
import moment from 'moment';

/* eslint-disable */
Array.prototype.remove = function () {
  let what;
  const a = arguments;
  let L = a.length;
  let ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

/* eslint-enable */

class Helpers {
  static analytics;

  static calculateAge(birthDate) {
    return moment().diff(birthDate, 'years');
  }

  static createToast(data) {
    if (data.hasOwnProperty('status') && data.hasOwnProperty('message')) {
      toast(data.message, { type: data.status });
    }
  }

  static validatePassword(password, password2) {
    if (password !== password2)
      return { status: 'error', message: 'Your passwords do not match' };
    if (password.length < 3)
      return { status: 'error', message: 'Your password is too short.' };
    return true;
  }

  static slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }

  static camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  /**
   * Create uppercase first letter.
   *
   * @param string {string} String to uppercase first letter of.
   * @returns {string} String with an uppercase first letter
   */
  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static reminderMinuteToDisplayConversion(value) {
    return {
      h: (value / 60) | 0, // eslint-disable-line no-bitwise
      m: value % 60 | 0, // eslint-disable-line no-bitwise
    };
  }

  static leftPad(number, targetLength) {
    let output = `${number}`;
    while (output.length < targetLength) {
      output = `0${output}`;
    }
    return output;
  }
}

export default Helpers;
