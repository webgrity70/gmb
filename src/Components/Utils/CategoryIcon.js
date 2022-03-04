import React from 'react';
import cx from 'classnames';
import * as health_fitness from '../../Assets/images/categories/health_fitness_circle.png';
import * as learn from '../../Assets/images/categories/learn_circle.png';
import * as work from '../../Assets/images/categories/work_circle.png';
import * as life from '../../Assets/images/categories/life_circle.png';

class CategoryIcon {
  static renderColorfulIcon(
    category_slug,
    with_text = false,
    style = { display: 'inline-block', marginRight: '10px' }
  ) {
    let icon;
    let name;
    if (category_slug === 'health-fitness') {
      icon = health_fitness;
      name = 'Health & Fitness';
    } else if (category_slug === 'life') {
      icon = life;
      name = 'Life';
    } else if (category_slug === 'work') {
      icon = work;
      name = 'Work';
    } else if (category_slug === 'learn') {
      icon = learn;
      name = 'Learn';
    }
    if (icon && name) {
      return (
        <React.Fragment>
          <img style={style} src={icon} alt="health and fitness" />
          {with_text && <span className="category-identifier">{name}</span>}
        </React.Fragment>
      );
    }
    return <div />;
  }

  static renderBlackWhiteIcon(category_slug, style = { fontSize: 17 }) {
    if (category_slug.toLowerCase() === 'health-fitness')
      return (
        <i
          className="icon gmb-category-health-fitness"
          style={style}
          key={category_slug}
        />
      );
    if (category_slug.toLowerCase() === 'learn')
      return (
        <i
          className="icon gmb-category-learn"
          style={style}
          key={category_slug}
        />
      );
    if (category_slug.toLowerCase() === 'work')
      return (
        <i
          className="icon gmb-category-work"
          style={style}
          key={category_slug}
        />
      );
    if (category_slug.toLowerCase() === 'life')
      return (
        <i
          className="icon gmb-category-life"
          style={style}
          key={category_slug}
        />
      );
  }

  static renderCircleIcon(category_slug) {
    return (
      <div className={cx('gmb-category-circle', category_slug)}>
        {CategoryIcon.renderBlackWhiteIcon(category_slug, {
          fontSize: 36,
          color: '#FFFFFF',
        })}
      </div>
    );
  }
}

export default CategoryIcon;
