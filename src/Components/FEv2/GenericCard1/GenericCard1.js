import React from 'react';
import BEMHelper from 'react-bem-helper';
//import { Link } from 'react-router-dom';

import { CategoryIcon } from '../../Elements/CategoriesIcons';

import './GenericCard1.scss';

const bem = BEMHelper({ name: 'GenericCard1', outputIsString: true });

const slugs = ['health-fitness', 'learn', 'work', 'life'];

const GenericCard1 = ({
  imgSrc,
  text1,
  text2,
  text3,
  icons = [],
  iconText,
  title,
  title2,
  title3,
  goLabel,
  goURL,
}) => {
  return (
    <div className={bem('container')}>
      <div className={bem('col1')}>
        <div className={bem('image')}>
          <img src={imgSrc} alt={'replace me'} />
        </div>

        <h3 className={bem('text1')}>{text1}</h3>
        <h3 className={bem('text2')}>{text2}</h3>
        <h3 className={bem('text3')}>{text3}</h3>
      </div>

      <div className={bem('col2')}>
        <div className={bem('iconRow')}>
          {slugs.map((sl) => (
            <CategoryIcon
              slug={sl}
              active={icons.includes((ic) => ic === sl)}
            />
          ))}

          {iconText && <span className={bem('iconText')}>{iconText}</span>}
        </div>

        <h1 className={bem('title')}>{title}</h1>

        {title2 && <h2 className={bem('title2')}>{title2}</h2>}

        {title3 && <h3 className={bem('title3')}>{title3}</h3>}

        <div onClick={() => {}} className={bem('goContainer')}>
          {goLabel}
        </div>
      </div>
    </div>
  );
};

export default GenericCard1;
