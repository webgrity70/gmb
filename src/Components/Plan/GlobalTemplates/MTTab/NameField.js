import React, { useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';
import moment from 'moment';
import {
  deleteTemplate as deleteTemplateAction,
  updateTemplate as updateTemplateAction,
} from '../../../../Actions/actions_plan';
import CategoriesIcons from '../../../Elements/CategoriesIcons';
import { bem } from './utils';

const NameField = ({
  name,
  id,
  isEditOn,
  toggleEdit,
  deleteTemplate,
  updateTemplate,
  onSelect,
  updatedAt,
  weeks,
  categories,
  isPremade,
}) => {
  const [text, setText] = useState(name);
  function remove() {
    if (isEditOn) toggleEdit(id);
    deleteTemplate(id);
  }
  function update() {
    updateTemplate({ id, name: text });
    toggleEdit(id);
  }
  if (!isEditOn) {
    return (
      <div
        className={cx(bem('template'), { 'flex-col md:flex-row': isPremade })}
        {...(onSelect && { onClick: onSelect })}
      >
        <div className="flex">
          {!isPremade && (
            <div className={bem('category-alone')}>
              <CategoriesIcons categories={categories} fullColor />
            </div>
          )}
          <div className={bem('title')}>
            <span>{name}</span>
            <span>Saved on {moment(updatedAt).format('ddd, MMM DD')}</span>
          </div>
        </div>

        <div
          className={cx('flex items-center', {
            'mt-3 md:mt-0 justify-between': isPremade,
          })}
        >
          {isPremade && (
            <div
              className={cx(bem('category'), {
                'flex-row md:flex-col flex-1': isPremade,
                'flex-col': !isPremade,
              })}
            >
              <div className="flex">
                <CategoriesIcons categories={categories} fullColor />
              </div>
              <span className="ml-3 md:ml-0">
                {weeks} {weeks > 1 ? 'weeks' : 'week'}
              </span>
            </div>
          )}
          <div className={bem('actions')}>
            <Icon
              name="pencil"
              onClick={(e) => [e.stopPropagation(), toggleEdit(id)]}
            />
            <Icon
              name="trash"
              onClick={(e) => [e.stopPropagation(), remove(id)]}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={bem('template', 'editing')}>
      <div>
        <Icon name="trash" onClick={remove} />
        <Input
          type="text"
          value={text}
          onChange={(e, { value }) => setText(value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="flex items-center mr-2 md:mr-6">
        <Icon
          name="close"
          onClick={(e) => [e.stopPropagation(), toggleEdit(id)]}
        />
        <Icon name="check" disabled={isEmpty(text)} onClick={update} />
      </div>
    </div>
  );
};

NameField.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  isEditOn: PropTypes.bool,
  toggleEdit: PropTypes.func,
  updatedAt: PropTypes.string,
  weeks: PropTypes.number,
  categories: PropTypes.arrayOf(PropTypes.shape()),
  deleteTemplate: PropTypes.func,
  updateTemplate: PropTypes.func,
  onSelect: PropTypes.func,
  isPremade: PropTypes.bool,
};

NameField.defaultProps = {
  isPremade: false,
};
export default connect(null, {
  deleteTemplate: deleteTemplateAction,
  updateTemplate: updateTemplateAction,
})(NameField);
