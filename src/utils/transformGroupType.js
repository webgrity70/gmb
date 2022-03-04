export default (type) => {
  switch (type) {
    case 'Organization':
      return 'Org';
    default:
      return type;
  }
};
