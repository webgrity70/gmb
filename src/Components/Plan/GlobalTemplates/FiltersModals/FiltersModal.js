/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import InputRange from 'react-input-range';
import CategoriesIcons from '../../../Elements/CategoriesIcons';
import { getFeaturedIcon } from '../utils';
import './FiltersModal.scss';

const bem = BEMHelper({ name: 'FiltersModal', outputIsString: true });

const FiltersModal = ({
  open,
  onClose,
  weeksMin,
  weeksMax,
  featured,
  categories,
  onChangeFeatured,
  onChangeCategory,
  onChangeDuration,
}) => (
  <Modal
    dimmer="inverted"
    closeIcon={{ name: 'close', color: 'grey' }}
    open={open}
    closeOnDimmerClick={false}
    onClose={onClose}
    size="large"
    className={bem()}
  >
    <div className={bem('content')}>
      <div>
        <h2>Filter the search!</h2>
      </div>
      <div className={bem('categories')}>
        <CategoriesIcons categories={categories} onClick={onChangeCategory} />
      </div>
      {onChangeFeatured && (
        <div
          className={bem('featured', {
            active: featured === undefined || featured,
          })}
          onClick={onChangeFeatured}
        >
          <Icon name={getFeaturedIcon(featured)} />
          <span>FEATURED</span>
        </div>
      )}
      <div className={bem('range-field')}>
        <span>
          DURATION: {weeksMin} - {weeksMax} WEEKS
        </span>
        <InputRange
          maxValue={12}
          minValue={0}
          step={1}
          value={{ min: weeksMin, max: weeksMax }}
          onChange={onChangeDuration}
        />
      </div>
      <Button color="orange" onClick={() => onClose(true)}>
        Filter results
      </Button>
    </div>
  </Modal>
);

FiltersModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.shape),
  onChangeFeatured: PropTypes.func,
  weeksMax: PropTypes.number,
  weeksMin: PropTypes.number,
  onChangeCategory: PropTypes.func,
  featured: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([null, undefined]),
  ]),
  onChangeDuration: PropTypes.func,
};

export default FiltersModal;
