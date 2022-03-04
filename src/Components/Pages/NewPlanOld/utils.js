import React from 'react';
import cx from 'classnames';
import CategoriesIcons from '../../Elements/CategoriesIcons/CategoriesIcons';

export const constants = {
  PLAN: 'plan',
};

export const types = [
  {
    name: 'I want to create a weekly Plan',
    description:
      'I want to schedule multiple events during the week that can repeat.',
    value: 'plan',
  },
  {
    name: 'I want to create one Event',
    description: 'I want to schedule a one-time event.',
    value: 'event',
  },
];

export const renderCustomContent = ({
  categories,
  className,
  allActive,
}) => () => {
  if (!categories) return null;
  return (
    <div className={cx('flex justify-center', className)}>
      <CategoriesIcons
        fullColor
        categories={categories.map(({ active, ...category }) => ({
          active: allActive || active,
          category,
        }))}
      />
    </div>
  );
};
