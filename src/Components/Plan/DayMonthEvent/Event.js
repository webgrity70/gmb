/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';
import { getObjectDiff } from '../../NewPlan/utils';
import PopupEventDetails from '../PopupDetails';
import EventIcon from './EventIcon';
import PlanContext from '../PlanContext';
import { EventDetailsModal } from '..';
import ChallengeDetailsModal from '../../Challenges/ChallengeDetailsModal';
import { eventDataToChallenge } from '../utils';

const Event = ({ data, isMobile }) => {
  const [open, setOpenPopup] = useState(false);
  const { timeFormat } = useContext(PlanContext);
  const [openModal, toggleModal] = useState(false);
  const partOfChallenge = data.challengeID !== null;

  function onCloseModal() {
    toggleModal(false);
  }
  function onOpenModal() {
    toggleModal(true);
  }
  function onMoveMouse(e) {
    if (open) {
      const popupComp = document.getElementById(`popup-${data.id}`);
      const modalComp = document.getElementById(`details-${data.id}`);
      const challengesComp = document.getElementById(
        `challenge-${data.challengeID}`
      );
      const triggerComp = document.getElementById(`event-${data.id}`);
      const outsidePopup =
        triggerComp &&
        popupComp &&
        !triggerComp.contains(e.target) &&
        !popupComp.contains(e.target);
      if (outsidePopup && !modalComp && !challengesComp) {
        setOpenPopup(false);
      }
    }
  }
  useEffect(() => {
    document.addEventListener('mousemove', onMoveMouse);
    document.addEventListener('mouseclick', onMoveMouse);
    return () => {
      document.removeEventListener('mousemove', onMoveMouse);
      document.removeEventListener('mouseclick', onMoveMouse);
    };
  });
  const detailsBaseProps = {
    onOpen: onOpenModal,
    onClose: onCloseModal,
    trigger: (
      <EventIcon
        id={`event-${data.id}`}
        data={data}
        onMouseEnter={() => !open && setOpenPopup(true)}
      />
    ),
  };
  function DetailsModal() {
    if (partOfChallenge) {
      return (
        <ChallengeDetailsModal
          {...detailsBaseProps}
          id={data.challengeID}
          open={openModal}
          challenge={eventDataToChallenge(data)}
        />
      );
    }
    return (
      <EventDetailsModal
        {...detailsBaseProps}
        event={data}
        openModal={openModal}
        timeFormat={timeFormat}
      />
    );
  }
  if (isMobile) return <DetailsModal />;
  return (
    <PopupEventDetails
      open={open}
      data={data}
      trigger={<DetailsModal />}
      onClosePopup={() => setOpenPopup(false)}
    />
  );
};

Event.propTypes = {
  data: PropTypes.shape(),
  isMobile: PropTypes.bool,
};
const Composed = withSizes(({ width }) => ({
  isMobile: width < 768,
}))(Event);

const MemoEvent = React.memo(Composed, (prevProps, nextProps) => {
  // need to compare only objects and without return the result;
  const diffValues = getObjectDiff(
    {
      data: prevProps.data,
      timeFormat: prevProps.timeFormat,
    },
    {
      data: nextProps.data,
      timeFormat: nextProps.timeFormat,
    }
  );
  return diffValues.length === 0;
});

export default MemoEvent;
