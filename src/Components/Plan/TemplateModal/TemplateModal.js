import React, { useEffect, useContext, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { initialize, change } from 'redux-form';
import cx from 'classnames';
import capitalize from 'lodash/capitalize';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment-timezone';
import flatMap from 'lodash/flatMap';
import { Modal, Button, Icon } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import PlanContext from '../PlanContext';
import Loading from '../../Loading';
import parseTimeFormat from '../../../utils/parseTimeFormat';
import {
  getTemplateDetails,
  getGlobalTemplate,
} from '../../../selectors/plans';
import {
  fetchTemplateDetails,
  createPlan as createPlanAction,
  setDraftPlan as setDraftPlanAction,
} from '../../../Actions/actions_plan';
import {
  getWeeks,
  sortDays,
  getNextInstanceDay,
  convertEventsToWeeksForm,
} from '../../NewPlan/utils';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import { getTemplateDetailsLoading } from '../../../selectors/requests';
import { joinGroup as joinGroupAction } from '../../../Actions/actions_groups';
// import NotificationsModal from '../../NotificationsModal/NotificationsModal';
import './TemplateModal.scss';
import WeeksEventsPlan from '../../Elements/WeeksEventsPlan/WeeksEventsPlan';
import StartDateModal from '../StartDateModal/StartDateModal';

const bem = BEMHelper({ name: 'TemplateModal', outputIsString: true });

const TemplateModal = ({
  id,
  template,
  globalTemplate,
  open,
  joinGroup,
  loading,
  history,
  createPlan,
  initializeForm,
  changeFormValue,
  onClose,
  fetchTemplate,
  isChallenge,
  onCloseInfo,
}) => {
  const { timeFormat, startingDay } = useContext(PlanContext);
  /* const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
   const onCloseModal = useCallback(() => {
    // setOpenNotificationsModal(false);
    onClose();
  }, [setOpenNotificationsModal, onClose]);
  */
  const [openStartDateModal, setOpenStartDateModal] = useState(false);
  const closeStartDateModal = useCallback(() => {
    setOpenStartDateModal(false);
  }, [setOpenStartDateModal, onClose]);
  useEffect(() => {
    if (isEmpty(template) && open) fetchTemplate(id);
  }, [open]);
  const modalProps = {
    open,
    onClose: () => onClose(),
    size: 'small',
    closeOnDimmerClick: false,
    dimmer: 'inverted',
    className: bem('modal'),
    closeIcon: { name: 'close', color: 'grey' },
  };
  if (!open) return null;
  if (loading || isEmpty(template)) {
    const error = !loading && isEmpty(template);
    return (
      <Modal {...modalProps} {...(error && { size: 'mini' })}>
        {loading && <Loading />}
        {error && (
          <div className={bem('error')}>
            <Icon name="warning circle" />
            Something went wrong, try again later!
          </div>
        )}
      </Modal>
    );
  }
  const owner = template.group || template.user;
  const link = template.group
    ? `/groups/${template.group.id}`
    : `/profile/${template.user.id}`;
  const data = Object.values(getWeeks({ initialValues: template, timeFormat }));
  const weekEvents = data.map((week) => {
    const days = Object.keys(week.days)
      .map((day) => day)
      .filter((day) => {
        let dayHasCheckedEvent = false;
        week.days[day].map((currentDay) => {
          if (currentDay.checked) {
            dayHasCheckedEvent = true;
          }
        });
        return dayHasCheckedEvent;
      });
    const weekDays = sortDays({
      values: days,
      startingDay,
    }).map((day) => {
      let events = week.days[day]
        .map((event) => {
          const [hour, minute] = event.time.split(':').map((e) => Number(e));
          const time = moment().set({ hour, minute });
          return {
            ...event,
            time,
            timeObj: event.time,
          };
        })
        .filter((event) => event.checked);
      return {
        events: events,
        day,
      };
    });
    return weekDays;
  });

  function onJoinAndCreate() {
    joinGroup(template.group.id);
    setOpenStartDateModal(true);
  }
  function getFrequency(frequency) {
    return (
      frequency.reduce((prev, current) => prev + current, 0) / frequency.length
    );
  }
  function onEditTemplate(startPlanDate = moment()) {
    /* setDraftPlan({
      ...pick(template.creationRequest, 'name', 'events'),
      owner,
      link,
    }); */
    //const startPlanDate = moment();
    const eventdate = moment(template.events[0].date);
    const eventTime = eventdate.clone().format('HH:mm');
    const [hour, minute] = eventTime.split(':').map((e) => Number(e));
    let startDay = startPlanDate.clone().set({ hour, minute });
    let firstEventDay = moment(template.events[0].date);
    let diff = startDay.diff(firstEventDay, 'days');

    let updated_events = template.events.map((event) => {
      return {
        ...event,
        date: moment(event.date).add(diff, 'days').utc().format(),
      };
    });

    const events = convertEventsToWeeksForm({
      events: updated_events,
      startDate: startPlanDate,
    });
    const eventsArr = Object.values(events);

    if (isChallenge) {
      changeFormValue('new-challenge', 'events', events);
      changeFormValue('new-challenge', 'date', {
        startDate: startPlanDate,
        endDate: eventsArr[eventsArr.length - 1].date,
      });
      changeFormValue('new-challenge', 'name', template.name);
      //Close date modal
      closeStartDateModal();
      //Close template modal
      onClose();
      //Close marketplace modal
      onCloseInfo();
    } else {
      initializeForm('new-plan', {
        goal: template.name,
        date: {
          startDate: startPlanDate,
          endDate: eventsArr[eventsArr.length - 1].date,
        },
        timezone: moment.tz.guess(),
        timezoneRestriction: template.timezoneRestriction || 'Global',
        createTemplate: false,
        templateName: '',
        globalTemplate: false,
        baseTemplate: template.id,
      });
      changeFormValue('new-plan', 'events', events);
      history.push('/plan/new');
    }
  }
  return (
    <Modal {...modalProps}>
      <Modal.Content>
        <div className="flex flex-col items-center">
          <span className={bem('title')}>{template.name}</span>
          {globalTemplate ? (
            <div className="text-center mb-4">
              <div className={bem('text')}>
                BY <Link to={link}>{owner.name}</Link> {'  '} | {'  '}
                {globalTemplate.weeks}{' '}
                {globalTemplate.weeks === 1 ? 'Week' : 'Weeks'}
              </div>
              <div className={bem('text')}>
                {globalTemplate.frequency &&
                  parseInt(getFrequency(globalTemplate.frequency), 10)}
                x / week
              </div>
            </div>
          ) : null}
        </div>
        <div className={bem('weeks-container')}>
          {weekEvents.map((weekEvent, index) => {
            return (
              <>
                <WeeksEventsPlan weekDays={weekEvent} index={index} />
              </>
            );
          })}
        </div>
        <div className={cx(bem('box'), bem('join'))}>
          <div className="flex flex-col items-start flex-1">
            <h5>{`Want to use this Plan${
              isChallenge ? ' for your challenge' : ''
            }?`}</h5>
            <p>
              Use the Plan as-is, or change dates, times, durations or locations
              to fit your schedule.
            </p>
          </div>

          <div>
            {template.group ? (
              <>
                <Button
                  color="orange"
                  onClick={() => setOpenStartDateModal(true)}
                >
                  Use Plan
                </Button>
                <Button color="orange" onClick={onJoinAndCreate}>
                  {isChallenge
                    ? 'Use this plan and join group'
                    : 'Use Plan and Join Group'}
                </Button>
              </>
            ) : (
              <Button
                color="orange"
                onClick={() => setOpenStartDateModal(true)}
              >
                Use Plan
              </Button>
            )}
          </div>
        </div>
        {/*
        <div className={bem('footer')}>
          <div>
            {template.grouup && (
              <div className={bem('group-description')}>
                <span>
                  This Plan was created by <Link to={link}>{owner.name}</Link>.
                  Would you like to join also this group?{' '}
                  <span>You might find others following the same Plan!</span>
                </span>
              </div>
            )}
            <div className={bem('group-actions')}>
              <Button className="edit" onClick={onEditTemplate}>
                <Icon name="pencil" />
                Edit Template
              </Button>
              <Button basic onClick={onEditTemplate}>
                Use Plan {template.group ? 'Only' : ''}
              </Button>
              {template.group && (
                <Button color="orange" onClick={onJoinAndCreate}>
                  Join Plan and Group
                </Button>
              )}
            </div>
          </div>
        </div>
        */}
      </Modal.Content>
      <StartDateModal
        open={openStartDateModal}
        onClose={closeStartDateModal}
        weekEvents={weekEvents}
        onEditTemplate={onEditTemplate}
        isChallenge={isChallenge}
      />
      {/* <NotificationsModal open={openNotificationsModal} onClose={onCloseModal} /> */}
    </Modal>
  );
};

const mapStateToProps = (state, { id }) => ({
  template: getTemplateDetails(state, { id }),
  loading: getTemplateDetailsLoading(state),
  globalTemplate: getGlobalTemplate(state, { id }),
});

TemplateModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCloseInfo: PropTypes.func,
  loading: PropTypes.bool,
  isMobile: PropTypes.bool,
  history: PropTypes.shape(),
  initializeForm: PropTypes.func,
  fetchTemplate: PropTypes.func,
  joinGroup: PropTypes.func,
  template: PropTypes.shape(),
  globalTemplate: PropTypes.shape(),
  createPlan: PropTypes.func,
  setDraftPlan: PropTypes.func,
  isChallenge: PropTypes.bool,
};

TemplateModal.defaultProps = {
  isChallenge: false,
};

const ConnectedTemplateModal = connect(mapStateToProps, {
  fetchTemplate: fetchTemplateDetails,
  createPlan: createPlanAction,
  joinGroup: joinGroupAction,
  setDraftPlan: setDraftPlanAction,
  initializeForm: initialize,
  changeFormValue: change,
})(TemplateModal);

export default withRouter(ConnectedTemplateModal);
