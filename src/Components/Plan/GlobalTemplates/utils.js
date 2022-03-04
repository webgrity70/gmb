import BEMHelper from 'react-bem-helper';

export const bem = BEMHelper({ name: 'GlobalTemplates', outputIsString: true });

export const getFeaturedIcon = (featured) => {
  if (featured) return 'check';
  if (featured === undefined) return 'minus';
  return 'times';
};
