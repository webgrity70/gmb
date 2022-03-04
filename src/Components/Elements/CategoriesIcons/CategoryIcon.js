/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';
import classNames from 'classnames';
import BEMHelper from 'react-bem-helper';
import * as health from '../../../Assets/images/categories/health_fitness_circle.png';
import * as learn from '../../../Assets/images/categories/learn_circle.png';
import * as work from '../../../Assets/images/categories/work_circle.png';
import * as life from '../../../Assets/images/categories/life_circle.png';
import './CategoryIcon.scss';

const baseClass = 'CategoryIcon';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const SOURCES = {
  learn,
  work,
  life,
  health,
};

const CategoryIcon = ({
  active,
  slug,
  name,
  fullColor,
  colorNoCircle,
  onClick,
  pk,
  customClassName,
}) => {
  function renderBlackWhite() {
    const className = classNames(`gmb-category-${slug}`, active && 'active');
    return <Icon className={className} />;
  }
  function renderCircleColored() {
    const slugForSource = slug.split('-')[0];
    return (
      <img
        className={classNames(bem('circle-colored'), {
          active: typeof active === 'boolean' ? active : true,
        })}
        src={SOURCES[slugForSource]}
        alt={slug}
      />
    );
  }
  function renderColored() {
    const className = classNames(`gmb-category-${slug}`, active && 'active');
    return <Icon className={className} />;
  }
  function renderIcon() {
    if (colorNoCircle) return renderColored();
    if (fullColor) return renderCircleColored();
    return renderBlackWhite();
  }
  const className = classNames(
    baseClass,
    customClassName,
    'ui inline',
    colorNoCircle && bem('colored')
  );
  const IconComp = (
    <div
      key={slug}
      className={classNames(className, { active })}
      onClick={() => onClick && onClick(pk)}
    >
      {renderIcon()}
    </div>
  );
  if (!name) return IconComp;
  return (
    <Popup
      content={name}
      style={{ zIndex: 9999, marginLeft: '-10px' }}
      trigger={IconComp}
    />
  );
};

CategoryIcon.propTypes = {
  active: PropTypes.bool,
  slug: PropTypes.string,
  pk: PropTypes.number,
  name: PropTypes.string,
  fullColor: PropTypes.bool,
  onClick: PropTypes.func,
  colorNoCircle: PropTypes.bool,
  customClassName: PropTypes.string,
};

export default CategoryIcon;
