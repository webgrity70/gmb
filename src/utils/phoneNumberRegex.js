// warning is wrong, escape in this case is correct. disabled.
// eslint-disable-next-line no-useless-escape
const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export default phoneNumberRegex;
