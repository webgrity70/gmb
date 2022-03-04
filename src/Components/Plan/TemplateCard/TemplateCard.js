import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { getGlobalTemplate } from '../../../selectors/plans';
import { getGroupTemplate } from '../../../selectors/groups';
import CategoriesIcons from '../../Elements/CategoriesIcons';
import TemplateModal from '../TemplateModal';
import './TemplateCard.scss';

const bem = BEMHelper({ name: 'TemplateCard', outputIsString: true });

function getFrequency(frequency) {
  return (
    frequency.reduce((prev, current) => prev + current, 0) / frequency.length
  );
}

const TemplateCard = ({ template, onCloseInfo, isChallenge }) => {
  const [openModal, setOpenModal] = useState(false);
  const owner = template.group || template.user;
  const link = template.group
    ? `/groups/${template.group.id}`
    : `/profile/${template.user.id}`;
  const showFrequency = template.frequency.length > 0;
  const closeModal = useCallback(
    (closeAll) => {
      if (onCloseInfo && closeAll) onCloseInfo();
      else setOpenModal(false);
    },
    [setOpenModal, onCloseInfo]
  );
  return (
    <div className={bem(null, { featured: template.featured })}>
      <div className={bem('content')}>
        <div className="flex w-full justify-between items-center">
          <div className={bem('by')}>
            by <Link to={link}>{owner.name}</Link> - {template.weeks}{' '}
            {template.weeks === 1 ? 'week' : 'weeks'}
          </div>
          <div className={bem('categories')}>
            <CategoriesIcons
              fullColor
              categories={template.categories.map((category) => ({
                category,
                active: true,
              }))}
            />
          </div>
        </div>
        <span className={bem('title')}>{template.name}</span>
        <div className="flex w-full justify-between items-end">
          <div className={bem('frequency')}>
            {showFrequency
              ? `${parseInt(getFrequency(template.frequency), 10)}x / week`
              : '-'}
          </div>
          <Button className={bem('info')} onClick={() => setOpenModal(true)}>
            More Info
          </Button>
        </div>
      </div>
      <div className={bem('open-trigger')}>
        <Icon name="angle right" onClick={() => setOpenModal(true)} />
      </div>
      <TemplateModal
        open={openModal}
        onCloseInfo={onCloseInfo}
        onClose={closeModal}
        id={template.id}
        isChallenge={isChallenge}
      />
    </div>
  );
};

TemplateCard.propTypes = {
  template: PropTypes.shape(),
  onCloseInfo: PropTypes.func,
  isChallenge: PropTypes.bool,
};

TemplateCard.defaultProps = {
  isChallenge: false,
};

export default TemplateCard;

const globalMapStateToProps = (state, { id }) => ({
  template: getGlobalTemplate(state, { id }),
});

export const GlobalTemplateCard = connect(globalMapStateToProps)(TemplateCard);

const groupMapStateToProps = (state, { id }) => ({
  template: getGroupTemplate(state, { id }),
});

export const GroupTemplateCard = connect(groupMapStateToProps)(TemplateCard);
