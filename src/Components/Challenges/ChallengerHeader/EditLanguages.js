import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import EditLanguagesModal from '../../NewGroup/EditLanguagesModal';
import { changeLanguages as changeLanguagesAction } from '../../../Actions/actions_challenges';

function EditLanguages({ value, id, changeLanguages }) {
  const [isModalOpen, setModalOpen] = useState(false);
  function onSubmit(val) {
    changeLanguages(id, val);
  }
  return (
    <>
      <Icon name="pencil" onClick={() => setModalOpen(true)} />
      <EditLanguagesModal
        open={isModalOpen}
        subTitle="Challenges Languages:"
        onClose={() => setModalOpen(false)}
        onSubmit={onSubmit}
        currentLanguages={value || []}
      />
    </>
  );
}

EditLanguages.propTypes = {
  id: PropTypes.number,
  changeLanguages: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.shape()),
};

export default connect(null, { changeLanguages: changeLanguagesAction })(
  EditLanguages
);
