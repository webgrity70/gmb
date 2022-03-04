import { CategoryIcon } from '../../Elements/CategoriesIcons';
import React from 'react';
import './CardBase.scss';

import BEMHelper from 'react-bem-helper';

const bem = BEMHelper({ name: 'CardBase', outputIsString: true });

const slugs = ['health-fitness', 'learn', 'work', 'life'];

export { slugs };

const CategoryIcons = ({ cats = [] }) => {
  return (
    <span className={bem('iconsContainer')}>
      {slugs.map((sl, i) => {
        const opts = {};
        if (cats.includes(sl)) {
          opts.colorNoCircle = true;
        }
        return <CategoryIcon key={i} slug={sl} {...opts} />;
      })}
    </span>
  );
};

export { CategoryIcons };
