/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import moment from 'moment';
import cx from 'classnames';
import { Modal, Button, Popup, Radio, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Loading from '../../Loading';
import history from '../../../history';
import { transformDay } from '../../NewPlan/utils';
import './StartDateModal.scss';
import { SingleDatePicker } from 'react-dates';

export const bem = BEMHelper({ name: 'StartDateModal', outputIsString: true });

function StartDateModal({
  id,
  open,
  onClose,
  weekEvents,
  onEditTemplate,
  isChallenge,
}) {
  const [planStartsOn, setPlanStartsOn] = useState();
  const [customStartDate, setCustomStartDate] = useState(moment());
  const [startDateFocused, setStartDateFocused] = useState();

  const baseModalProps = {
    open,
    onClose: () => onClose(),
    dimmer: 'inverted',
    className: bem(),
    closeOnDimmerClick: false,
    closeIcon: { name: 'close', color: 'grey' },
  };

  const onplanStartOptionChange = (e, { value }) => {
    setPlanStartsOn(value);
    /*
    if(e === "nextDay"){
      Object.values(events)
      const date = {
        endDate: moment(endDate).add(1, "day"),
        startDate: moment().add(1, "day"),
      }
      changeFormValue('new-plan', 'date', date);
    }else if(e === "nextWeek"){
      const date = {
        endDate: moment(endDate).add(1, "day"),
        startDate: moment().add(1, "day"),
      }
      changeFormValue('new-plan', 'date', date);
    }
    */
  };
  let startingDay =
    weekEvents && weekEvents[0] && weekEvents[0][0] && weekEvents[0][0].day
      ? weekEvents[0][0].day
      : '';
  let startingEvent = weekEvents[0][0].events[0].time;
  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  useEffect(() => {
    let startingEvent = weekEvents[0][0].events[0].time;
    if (moment(startingEvent).isBefore('now')) {
      setPlanStartsOn('today');
    } else {
      setPlanStartsOn('nextDay');
    }
  }, []);

  const getStartDay = () => {
    const [hour, minute] = weekEvents[0][0].events[0].timeObj
      .split(':')
      .map((e) => Number(e));
    let startMoment;
    const dayINeed = transformDay(weekEvents[0][0].day);
    switch (planStartsOn) {
      case 'today':
        // code block
        startMoment = moment().set({ hour, minute });
        break;
      case 'nextDay':
        // code block
        startMoment = moment().add('1', 'day').set({ hour, minute });
        break;
      case 'nextWeek':
        // code block
        const today = moment().isoWeekday();
        if (today < dayINeed) {
          startMoment = moment().isoWeekday(dayINeed).set({ hour, minute });
        } else {
          startMoment = moment()
            .add(1, 'weeks')
            .isoWeekday(dayINeed)
            .set({ hour, minute });
        }
        break;
      case 'customDays':
        startMoment = customStartDate.clone().set({ hour, minute });
        break;
      default:
      // code block
    }
    return startMoment;
  };

  const viewPlan = () => {
    let startTime = getStartDay();
    onEditTemplate(startTime);
  };

  return (
    <>
      <Modal {...baseModalProps} id={`challenge-${id}`}>
        <Modal.Content>
          <div className="flex flex-col items-center">
            <span className={bem('title')}>Choose Start Date</span>
          </div>
          <p className={bem('plan_info')}>
            This plan is designed to start on a{' '}
            <span className={bem('plan_info-startingDay')}>{startingDay}</span>{' '}
            at {moment(startingEvent).format('h:mm a')}. Would you like to:
          </p>
          <div className={bem('start_date_options_container')}>
            <div className={bem('start_date_options_container-options')}>
              {moment(startingEvent).isBefore('now') ? (
                <Form.Field>
                  <Radio
                    label={`Start this ${
                      isChallenge ? 'challenge' : 'plan'
                    } today at ${moment(startingEvent).format('h:mm a')}.`}
                    name="planStartInput"
                    value="today"
                    checked={planStartsOn === 'today'}
                    onChange={onplanStartOptionChange}
                  />
                </Form.Field>
              ) : (
                <Form.Field>
                  <Radio
                    label={`Start this ${
                      isChallenge ? 'challenge' : 'plan'
                    } tomorrow at ${moment(startingEvent).format('h:mm a')}.`}
                    name="planStartInput"
                    value="nextDay"
                    checked={planStartsOn === 'nextDay'}
                    onChange={onplanStartOptionChange}
                  />
                </Form.Field>
              )}
              <Form.Field>
                <Radio
                  label={`Start this ${
                    isChallenge ? 'challenge' : 'plan'
                  } next ${capitalize(startingDay)} at ${moment(
                    startingEvent
                  ).format('h:mm a')}.`}
                  name="planStartInput"
                  value="nextWeek"
                  checked={planStartsOn === 'nextWeek'}
                  onChange={onplanStartOptionChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Choose my own dates and times."
                  name="planStartInput"
                  value="customDays"
                  checked={planStartsOn === 'customDays'}
                  onChange={onplanStartOptionChange}
                />
              </Form.Field>
              {planStartsOn === 'customDays' && (
                <Form.Field>
                  <SingleDatePicker
                    date={customStartDate}
                    onDateChange={(date) => setCustomStartDate(date)}
                    focused={startDateFocused}
                    onFocusChange={({ focused }) =>
                      setStartDateFocused(focused)
                    }
                    id="eventDate"
                    placeholder="Select a date"
                    small
                    showDefaultInputIcon
                  />
                  {/*
                  <SingleDatePicker
                    date={this.state.date || null}
                    onDateChange={(date) => this.setState({ date })}
                    focused={this.state.focused}
                    displayFormat={
                      this.state.calendarOptions.dateFormat
                    }
                    onFocusChange={({ focused }) =>
                      this.setState({ focused })
                    }
                    id="eventDate"
                    placeholder="Select a date"
                    firstDayOfWeek={parseInt(
                      this.state.calendarOptions.startingDay,
                      10
                    )}
                    small
                    showDefaultInputIcon
                  />
                    */}
                </Form.Field>
              )}
            </div>
          </div>

          <div className={cx(bem('box'), bem('join'))}>
            <div className="flex flex-col items-start flex-1">
              <h5>{`Want to use this Plan${
                isChallenge ? ' for your challenge' : ''
              }?`}</h5>
              <p>
                Use the Plan as-is, or change dates, times, durations or
                locations to fit your schedule.
              </p>
            </div>
            <div>
              <div className={bem('group-actions')}>
                <Button basic onClick={onClose}>
                  Cancel
                </Button>
                <Button color="orange" onClick={viewPlan}>
                  {`View ${isChallenge ? 'Challenge' : 'Plan'}`}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}
const mapStateToProps = () => ({});

StartDateModal.propTypes = {
  id: PropTypes.number,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  weekEvents: PropTypes.shape(),
  onEditTemplate: PropTypes.func,
  isChallenge: PropTypes.bool,
};

StartDateModal.defaultProps = {
  isChallenge: false,
};

export default connect(mapStateToProps, {})(StartDateModal);
