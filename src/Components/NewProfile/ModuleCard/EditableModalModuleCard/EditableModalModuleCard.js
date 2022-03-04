import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import ModuleCard from '../ModuleCard';
import CardButton from '../CardButton';

function EditableModalModuleCard(props) {
  const { modalContent, modalProps, triggerEditId, ...rest } = props;
  const { profileId, ...restModalProps } = modalProps;
  const [isModalOpen, setModalOpen] = useState(false);

  function closeModal() {
    setModalOpen(false);
  }

  function openModal() {
    setModalOpen(true);
  }
  return (
    <>
      <ModuleCard
        {...rest}
        footer={
          <CardFooter triggerEditId={triggerEditId} openModal={openModal} />
        }
      />
      <Modal
        closeIcon={{ name: 'close', color: 'grey' }}
        dimmer="inverted"
        {...restModalProps}
        open={isModalOpen}
        onClose={closeModal}
      >
        {modalContent({ closeModal, profileId })}
      </Modal>
    </>
  );
}

EditableModalModuleCard.propTypes = {
  triggerEditId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  modalProps: PropTypes.shape({}),
  modalContent: PropTypes.func,
};

function CardFooter({ triggerEditId, openModal }) {
  return (
    <div className="flex">
      <div className="ml-auto">
        <CardButton onClick={openModal} id={triggerEditId}>
          Edit
        </CardButton>
      </div>
    </div>
  );
}

CardFooter.propTypes = {
  triggerEditId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  openModal: PropTypes.func.isRequired,
};

export default EditableModalModuleCard;
