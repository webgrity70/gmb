/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import cx from 'classnames';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import CategoriesIcons from '../../Elements/CategoriesIcons';
import NameField from './NameField';
import { bem } from './TemplatesTrigger';
import { fetchTemplateDetails as fetchTemplateDetailsAction } from '../../../Actions/actions_plan';

const ModalContent = ({ type, onSelect, templates, fetchTemplateDetails }) => {
  const [editing, setEditable] = useState([]);
  function toggleEntryEdit(id) {
    const news = editing.includes(id)
      ? editing.filter((e) => e !== id)
      : [...editing, id];
    setEditable(news);
  }
  async function loadTemplate(id) {
    const { detail, creationRequest } = await fetchTemplateDetails(id);
    if (detail) {
      toast.error(detail);
    } else {
      onSelect(creationRequest);
    }
  }
  return (
    <div className={bem()}>
      <Fragment>
        <h3>Your {type} Templates</h3>
        {templates.length > 0 ? (
          <div className={bem('list-container')}>
            {templates.map((template) => (
              <Fragment key={template.id}>
                <div className={bem('template')}>
                  <div
                    className={cx(bem('details'), 'flex-1')}
                    onClick={() => loadTemplate(template.id)}
                  >
                    <NameField
                      {...template}
                      isEditOn={editing.includes(template.id)}
                      toggleEdit={toggleEntryEdit}
                    />
                    <span>
                      Saved on{' '}
                      {moment(template.updatedAt).format('ddd, MMM DD')}
                    </span>
                  </div>
                  <div className={bem('category')}>
                    <div className="flex">
                      <CategoriesIcons
                        categories={template.categories}
                        fullColor
                      />
                    </div>
                    <span>
                      {template.weeks} {template.weeks > 1 ? 'weeks' : 'week'}
                    </span>
                  </div>
                </div>
                <div className={bem('divider')} />
              </Fragment>
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-6">
            <h4>You don't have templates yet.</h4>
          </div>
        )}
      </Fragment>
    </div>
  );
};

ModalContent.propTypes = {
  type: PropTypes.string,
  templates: PropTypes.arrayOf(PropTypes.shape({})),
  onSelect: PropTypes.func,
  fetchTemplateDetails: PropTypes.func,
};

export default connect(null, {
  fetchTemplateDetails: fetchTemplateDetailsAction,
})(ModalContent);
