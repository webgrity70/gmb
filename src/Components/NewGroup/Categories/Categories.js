import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import { withCategories } from '../../HoCs';
import './Categories.scss';

const Categories = ({ categories, currentCategories, showError, onChange }) => (
  <div className={cx('NewGroupCategories', { error: showError })}>
    {categories.map((cat) => (
      <Checkbox
        label={cat.name}
        key={cat.pk}
        onChange={() => onChange(cat.name)}
        checked={currentCategories.includes(cat.name)}
      />
    ))}
  </div>
);

Categories.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      pk: PropTypes.number,
      name: PropTypes.string,
      slug: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
  showError: PropTypes.bool,
  currentCategories: PropTypes.arrayOf(PropTypes.string),
};
export default withCategories({})(Categories);
