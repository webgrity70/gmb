/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { Fragment, useState } from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import { compose } from 'redux';
import cx from 'classnames';
import { touch } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import BehaviorModal from '../../NewPlan/BehaviorModal';
import {
  getSlug,
  getTotalPoints,
  parseMinutesToTimeShort,
} from '../../NewPlan/utils';
import MarkDown from '../../Elements/MarkDown';
import MediaModal from '../../Elements/MediaModal';
import { getMyProfile } from '../../../selectors/profile';
import history from '../../../history';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import EditExistingEvent from '../../NewPlan/EditExistingEvent';
import { getInitialValues, getSaveAsTemplateEvent } from './utils';
import SaveEventAsTemplate from '../SaveEventAsTemplate/SaveEventAsTemplate';
import { shouldRenderCheckIn } from '../utils';
import Avatar from '../../Elements/Avatar';
import { deleteEvent as deleteEventAction } from '../../../Actions/actions_plan';
import './EventDetailsModal.scss';

const repeatFormName = 'new-event-repeat';

const bem = BEMHelper({ name: 'EventDetailsModal', outputIsString: true });

const EventDetailsModal = ({
  event,
  trigger,
  onOpen,
  openModal,
  onClose,
  deleteEvent,
  onDelete,
  timeFormat,
  touchField,
  myUser,
}) => {
  if (!event) return null;
  if (!openModal) {
    return (
      <Modal
        onOpen={onOpen}
        open={openModal}
        closeOnDimmerClick={false}
        trigger={trigger}
        className={bem()}
        dimmer="inverted"
        closeIcon={{ name: 'close', color: 'grey' }}
      />
    );
  }

  const [openMediaModal, setOpenMediaModal] = useState(false);
  const [mediaData, setMediaData] = useState('');
  const setMediaModal = (value) => {
    setMediaData(value);
    setOpenMediaModal(true);
  };

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openBehaviorModal, setOpenBehaviorModal] = useState(false);
  const categorySlug = event.habit.category.slug || event.habit.categorySlug;
  const duration = event.session_duration || event.duration;
  const checkin = event.check_in || event.checkIn;
  const shouldShowCheckIn =
    checkin !== null && checkin !== undefined && event.intention !== 0;
  const shouldShowTotal = shouldShowCheckIn || event.intention !== null;
  const date = event.start_date || event.start || null;
  const intentionDate = event.intention_date || event.intentionDate || null;
  const checkInDate = event.check_in_date || event.checkInDate || null;
  const planName = event.planName || event.plan_name;
  const isMyEvent = !event.user || event.user.id === myUser.pk;
  const alreadyStarted = moment(date).isAfter(moment(), 'minute');
  const checkInWindowEnd = event.challengeID
    ? moment(event.start).add(event.duration + 60, 'minutes')
    : moment(event.checkInWindowEnd);
  const finished = checkInWindowEnd.clone().isBefore(moment(), 'minute');
  const eventId = event.id || event.pk;
  const allowEdit =
    !shouldShowCheckIn && alreadyStarted && event.intention !== 0;
  const allowDelete = !finished && !intentionDate && !checkInDate;
  const shouldShowCheckinButton = shouldRenderCheckIn({
    myId: myUser.pk,
    ...event,
    checkInWindowEnd,
  });
  const checkInNote = event.check_in_note || event.checkInNote;

  function getFormIntervalDate() {
    const startDate = moment();
    const endDate = moment().add(12, 'weeks');
    return { startDate, endDate };
  }
  function onDeleteEvent() {
    deleteEvent(eventId);
    onClose();
    if (onDelete) onDelete();
  }
  function onCheckIn() {
    history.push(`/dashboard/check-in/${eventId}`);
  }
  function onRepeat() {
    setOpenBehaviorModal(true);
    touchField(repeatFormName, 'date', 'duration', 'time');
  }
  return (
    <Fragment>
      <Modal
        onClose={onClose}
        onOpen={onOpen}
        open={openModal}
        trigger={trigger}
        className={bem()}
        dimmer="inverted"
        closeIcon={{ name: 'close', color: 'grey' }}
        id={`details-${event.id}`}
      >
        <Modal.Content>
          {/*eventId*/}
          {event.user && (
            <div className="absolute">
              <div className={bem('avatar')}>
                <Avatar avatar={event.user.avatar} id={event.user.id} />
              </div>
              <span className={cx(bem('date'), 'ml-10')}>
                {event.user.name === myUser.name ? 'You' : event.user.name}
              </span>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <CategoryIcon
              slug={getSlug(event.habit.category.name || event.habit.category)}
              name={event.habit.category.name}
              colorNoCircle
            />
            <span className={bem('title')}>
              {event.habit.name} for {parseMinutesToTimeShort(duration)}
            </span>
            {shouldShowTotal && (
              <span className={bem('points', [categorySlug, 'total'])}>
                +{getTotalPoints(event)}
              </span>
            )}
          </div>
          <div className={bem('details')}>
            {moment(date).format('MMM D, ddd').toUpperCase()} |{' '}
            {moment(date)
              .format(parseTimeFormat(timeFormat, date))
              .toUpperCase()}
          </div>
          <div className={bem('content')}>
            {planName && (
              <div className="flex mb-2 sm:mb-1">
                <span className={cx(bem('label', 'fixed'), 'mr-2')}>Plan:</span>
                <div className="text-left flex flex-wrap">
                  <span className={bem('plan')}>{planName}</span>
                  {(event.planCreator || isMyEvent) && (
                    <div>
                      <span
                        className={cx(
                          'hidden-el sm:inline',
                          bem('label'),
                          'ml-2'
                        )}
                      >
                        {' '}
                        |{' '}
                      </span>
                      <span className={cx(bem('label'), 'mr-2 ml-2 sm:ml-1')}>
                        Created By:{' '}
                      </span>
                      <span className={bem('value')}>
                        {!event.planCreator || event.planCreator === myUser.name
                          ? 'You'
                          : event.planCreator}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex mb-2 sm:mb-1">
              <span className={cx(bem('label', 'fixed'), 'mr-2')}>
                Location:
              </span>
              <span className={bem('value')}>
                <MarkDown
                  source={event.location}
                  setMediaModal={setMediaModal}
                />
              </span>
            </div>
            {event.milestone && (
              <div className="flex mb-2 sm:mb-1">
                <span className={cx(bem('label', 'fixed'), 'mr-2')}>
                  Milestone:
                </span>
                <span className={bem('value')}>{event.milestone}</span>
                <span
                  className={bem('milestone', { on: event.milestoneOnTrack })}
                >
                  {event.milestoneOnTrack && (
                    <Fragment>
                      On Track
                      <span className="ml-3">+{event.milestonePoints}</span>
                    </Fragment>
                  )}
                  {!event.milestoneOnTrack &&
                    event.milestonePoints &&
                    'Off Track'}
                </span>
              </div>
            )}
            {event.specifics && (
              <div className={bem('specifics')}>
                <span className={cx(bem('label', 'fixed'), 'mr-2')}>
                  Description:
                </span>
                <MarkDown
                  source={event.specifics}
                  setMediaModal={setMediaModal}
                />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <div className="flex flex-1 mb-2 mt-4 sm:mt-6">
                <span className={cx(bem('label'), 'mr-2')}>Confirmed</span>
                <div className={bem('divider')} />
              </div>
              {event.intention !== null && (
                <div className={bem('box')}>
                  <span className={bem('date')}>
                    {intentionDate
                      ? moment(intentionDate).format(
                          parseTimeFormat(timeFormat, intentionDate)
                        )
                      : ''}
                  </span>
                  <span className={cx(bem('date'), 'ml-6')}>
                    Confirmed: {event.intention === 100 ? 'Yes' : 'No'}
                  </span>
                  <span className={bem('points', categorySlug)}>
                    +{event.intention_points || event.intentionPoints}
                  </span>
                  <span className={bem('note')}>
                    {event.intention_note ? (
                      <MarkDown
                        source={event.intention_note}
                        setMediaModal={setMediaModal}
                      />
                    ) : (
                      event.intentionNote && (
                        <MarkDown
                          source={event.intentionNote}
                          setMediaModal={setMediaModal}
                        />
                      )
                    )}
                  </span>
                </div>
              )}
              {event.intention === null && alreadyStarted && (
                <span className={bem('ontime')}>Event hasn't started</span>
              )}
              {event.intention === null && !alreadyStarted && (
                <span className={cx('font-medium text-left')}>-</span>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-1 mb-2 mt-4">
                <span className={bem('label')}>Check-in</span>
                <div className={bem('divider')} />
              </div>
              {shouldShowCheckIn || shouldShowCheckinButton ? (
                <div className={bem('box')}>
                  {shouldShowCheckinButton && (
                    <div>
                      <span className={bem('ontime')}>
                        You haven't checked-in yet!
                      </span>
                      <Button
                        onClick={onCheckIn}
                        color="orange"
                        className={bem('check-in')}
                      >
                        Check-in
                      </Button>
                    </div>
                  )}
                  {shouldShowCheckIn && (
                    <Fragment>
                      <span className={bem('date')}>
                        {checkInDate
                          ? moment(checkInDate).format(
                              parseTimeFormat(timeFormat, checkInDate)
                            )
                          : ''}
                      </span>
                      <span className={cx(bem('date'), 'ml-6')}>
                        Check-in: {event.check_in || event.checkIn}%
                      </span>
                      <span className={bem('points', categorySlug)}>
                        +{event.check_in_points || event.checkInPoints}
                      </span>
                      {(event.prompts || checkInNote) && (
                        <div className="flex-0 sm:flex-1 w-full sm:w-auto">
                          {event.prompts &&
                            event.prompts.length > 0 &&
                            event.prompts.map((prompt, promptIndex) => (
                              <div
                                className={bem('prompt')}
                                key={`ed-promp-${promptIndex + 1}`}
                              >
                                <div className="mr-2">{prompt.prompt}</div>
                                <div className="flex-1">
                                  {prompt.promptValue ? (
                                    <MarkDown
                                      source={prompt.promptValue}
                                      setMediaModal={setMediaModal}
                                    />
                                  ) : (
                                    '-'
                                  )}
                                </div>
                              </div>
                            ))}
                          <div className={bem('prompt')}>
                            <div className="mr-2">General note</div>
                            <div className="flex-1">
                              {checkInNote ? (
                                <MarkDown
                                  source={checkInNote}
                                  setMediaModal={setMediaModal}
                                />
                              ) : (
                                '-'
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Fragment>
                  )}
                </div>
              ) : (
                <span className={bem('ontime')}>
                  {finished || event.intention === 0
                    ? '-'
                    : "Event hasn't started"}
                </span>
              )}
            </div>
          </div>
        </Modal.Content>
        <div className={bem('footer')}>
          {isMyEvent && (
            <Fragment>
              <SaveEventAsTemplate
                event={getSaveAsTemplateEvent(event)}
                trigger={
                  <div className={bem('template-trigger')}>
                    <Icon name="save" />
                    <span>Save as template</span>
                  </div>
                }
              />
              <div className={bem('actions')}>
                <div className="pointer" onClick={onRepeat}>
                  <Icon name="repeat" color="orange" />
                  <span>Repeat</span>
                </div>
                {allowDelete && (
                  <div className="ml-4 pointer" onClick={onDeleteEvent}>
                    <Icon name="trash" color="orange" />
                    <span>Delete</span>
                  </div>
                )}
                {allowEdit && (
                  <div
                    className="pointer"
                    onClick={() => setOpenEditModal(true)}
                  >
                    <Icon name="pencil" color="orange" />
                    <span>Edit</span>
                  </div>
                )}
              </div>
            </Fragment>
          )}
        </div>
      </Modal>
      {openEditModal && (
        <EditExistingEvent
          open
          planId={event.plan_id || event.planID}
          id={eventId}
          onClose={(reload) => [setOpenEditModal(false), onClose(reload)]}
          initialValues={getInitialValues({ event, timeFormat })}
        />
      )}
      <BehaviorModal
        open={openBehaviorModal}
        onClose={() => setOpenBehaviorModal(false)}
        type="single"
        title="Repeat Event"
        form={repeatFormName}
        initialValues={getInitialValues({
          event: { ...event, start_date: moment().add(10, 'minutes') },
          timeFormat,
        })}
        planEndDate={moment().add(12, 'weeks')}
        currentIntervalDate={getFormIntervalDate()}
        isSingleEvent
        hideOptions
      />
      <MediaModal
        open={openMediaModal}
        onClose={() => setOpenMediaModal(false)}
        mediaData={mediaData}
      />
    </Fragment>
  );
};

EventDetailsModal.propTypes = {
  event: PropTypes.shape(),
  trigger: PropTypes.node,
  onOpen: PropTypes.func,
  openModal: PropTypes.bool,
  touchField: PropTypes.func,
  onClose: PropTypes.func,
  deleteEvent: PropTypes.func,
  timeFormat: PropTypes.string,
  myUser: PropTypes.shape(),
  onDelete: PropTypes.func,
};

const mapStateToProps = (state) => ({
  myUser: getMyProfile(state),
});

export default compose(
  withRouter,
  connect(mapStateToProps, {
    deleteEvent: deleteEventAction,
    touchField: touch,
  })
)(EventDetailsModal);
