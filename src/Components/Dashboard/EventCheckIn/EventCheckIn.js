import Slider from 'rc-slider';
import moment from 'moment';
import cx from 'classnames';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Icon, Button, Accordion } from 'semantic-ui-react';
import React, { Component, useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import confetti from 'canvas-confetti';
import Countdown from 'react-countdown';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
import DashboardService from '../../../Services/DashboardService';
import Helpers from '../../Utils/Helpers';
import { TrackEvent } from '../../../Services/TrackEvent';
import {
  trackMilestone as trackMilestoneAction,
  deletePlan as deletePlanAction,
} from '../../../Actions/actions_plan';
import Counter from '../Counter';
import * as configs from './options';
import { leaveChallenge as leaveChallengeAction } from '../../../Actions/actions_challenges';
import {
  getLoadingLeaveChallenge,
  getDeletePlanLoading,
} from '../../../selectors/requests';
import './EventCheckIn.scss';

class CheckIn extends Component {
  defaultPercentage = 50;

  trackingChange = _.debounce(() => {
    const { completionPercentage } = this.state;
    TrackEvent('dash-check-in-percent', {
      percentage: completionPercentage,
    });
  }, 250);

  constructor(props) {
    super(props);
    this.state = {
      completionPercentage: props.progress || this.defaultPercentage,
      note: '',
      checked_in: false,
      milestoneView: false,
      checkInView: false,
      loadingYes: false,
      activeAccordionIndex: props.plan.prompts.length
        ? 0
        : props.plan.prompts.length,
      loadingNo: false,
      milestoneResponse: null,
      transitionClass: '',
      prompts: props.plan.prompts,
      generalNoteRef: React.createRef(),
      promptsInputsRefs: props.plan.prompts.map(() => React.createRef()),
    };
    this.onSliderChange = this.onSliderChange.bind(this);
    this.trackingChange = this.trackingChange.bind(this);
  }

  componentDidMount() {
    const { match, plan, history } = this.props;
    const { mode } = match.params;
    const same = parseInt(match.params.id, 10);

    parseInt(plan.pk, 10);
    if (mode === 'ready' && same) {
      if (match.params.progress) {
        this.readyToCheckIn(match.params.progress === 'yes');
        history.push('/dashboard');
      }
    } else if (mode === 'check-in' && same) {
      const progress = parseInt(match.params.progress, 10);
      if (!isNaN(progress)) {
        this.checkInAfterCompletingEvent(_.clamp(progress, 0, 100));
        history.push('/dashboard');
      }
    }
  }

  // noinspection JSUnusedLocalSymbols
  UNSAFE_componentWillReceiveProps(nextProps, _nextContent) {
    const { plan } = this.props;

    if (nextProps.plan.pk !== plan.pk) {
      this.setState({
        completionPercentage: nextProps.progress || this.defaultPercentage,
        note: '',
        checked_in: false,
        checked_ready: false,
        milestoneView: false,
        milestoneResponse: null,
        activeAccordionIndex: nextProps.plan.prompts.length
          ? 0
          : nextProps.plan.prompts.length,
        prompts: nextProps.plan.prompts,
        promptsInputsRefs: nextProps.plan.prompts.map(() => React.createRef()),
      });
    }
  }

  onSliderChange = (value) => {
    this.setState({ completionPercentage: value });
    this.trackingChange();
  };

  onKeyPress(event) {
    const code = event.keyCode || event.which;
    if (code === 13) {
      // Enter
      this.checkInAfterCompletingEvent();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  getCheckedInMessage() {
    const { plan } = this.props;
    const {
      checked_in: checkedIn,
      checked_ready: checkedReady,
      xp_gained: XPGained,
      completionPercentage,
      ready,
    } = this.state;
    let subTitle = null;

    let message = 'Something went terribly wrong!';
    if (checkedIn) {
      const percentage = parseInt(completionPercentage, 10);
      subTitle = `You completed ${percentage}%`;
      if (percentage === 0) {
        message = 'See if you need to make any changes to your plan.';
      } else if (percentage > 0 && percentage < 25) {
        message = 'See if you can improve on it tomorrow.';
      } else if (percentage >= 25 && percentage < 50) {
        message =
          "See how you can make the habit smaller so it's easier to win!";
      } else if (percentage >= 50 && percentage < 75) {
        message =
          'See if you can make the habit even smaller so you can get to 100%.';
      } else if (percentage >= 75 && percentage < 100) {
        message =
          'See if you can adjust the time or make your habit smaller to get to 100%.';
      } else if (percentage === 100) {
        message = 'Do a little dance. You did everything!';
      }
    } else if (checkedReady) {
      if (ready) {
        subTitle = 'Great!';
        message = "Check in when you're done!";
      } else {
        subTitle = 'No problem!';
        message = 'See if you can catch up with the next one.';
      }
    }
    return (
      <React.Fragment>
        {subTitle ? <div className="sub-title">{subTitle}</div> : ''}
        <div className={`points ${plan.habit.category.slug}`}>
          +{XPGained || 0}
        </div>
        <div className="description">{message}</div>
      </React.Fragment>
    );
  }

  getProgressOptions = (progress) => {
    if (progress === 0) return 'emptyOptions';
    if (progress > 0 && progress <= 25) return 'fourthOptions';
    if (progress > 25 && progress <= 50) return 'halfOptions';
    return 'fullOptions';
  };

  checkInAfterCompletingEvent = async (progress) => {
    const { completionPercentage, note, prompts } = this.state;
    const { plan, onUpdatePlan } = this.props;
    this.setState({ loadingYes: true });
    if (isNaN(progress)) progress = completionPercentage;
    try {
      const checkInWindowEnd = moment(plan.start_date)
        .set('second', 0)
        .add(Number(plan.session_duration) + 60 * 24, 'minutes');

      const canCheckIn =
        moment() >= moment(plan.start_date) &&
        moment().isBefore(checkInWindowEnd);

      const data = await DashboardService.CheckInEvent(
        plan.pk,
        note,
        progress,
        prompts,
        plan.challenge_type === 'Flexible' ? canCheckIn : plan.can_check_in
      );
      // Helpers.createToast(data);
      this.setState({
        completionPercentage: progress,
        loadingYes: false,
        xp_gained: data.xp,
        checkInView: false,
        checked_in: true,
      });
      this.showSuccessConfetti(progress);
      setTimeout(() => {
        if (!plan.milestone) onUpdatePlan();
        else {
          this.setState({ milestoneView: !!plan.milestone });
        }
      }, 3000);
      TrackEvent('dash-check-in-time');
    } catch (data) {
      Helpers.createToast(data);
      this.setState({
        loadingYes: false,
        loadingNo: false,
      });
      onUpdatePlan();
    }
  };

  showSuccessConfetti = (completionPercentage) => {
    const { isMobile } = this.props;
    const config = configs[this.getProgressOptions(completionPercentage)];
    if (completionPercentage === 100) {
      const end = Date.now() + 15 * 75;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }
        confetti({
          ...config,
          origin: {
            x: Math.random(),
            y: isMobile ? 0.45 : 0.6,
          },
        });
        return null;
      }, 200);
    } else if (completionPercentage === 0) {
      const end = Date.now() + 5 * 100;
      (function frame() {
        confetti({
          ...config,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } else {
      setTimeout(() => {
        confetti({
          ...config,
          origin: {
            y: isMobile ? 0.45 : 0.6,
            x: isMobile ? 0.45 : 0.75,
          },
        });
      }, 250);
    }
  };

  onTrackMilestone = async (done) => {
    const { onUpdatePlan, plan, trackMilestone } = this.props;
    this.setState({
      loadingYes: !!done,
      loadingNo: !done,
    });
    try {
      await trackMilestone(plan.pk, done);
      this.setState({
        loadingYes: false,
        loadingNo: false,
        milestoneResponse: done
          ? {
              title: 'Woohoo!',
              description: 'Think about what’s working to keep you on track.',
            }
          : {
              title: 'No Problem.',
              description:
                'Ask what’s preventing you from staying on track and see if you need to adjust your plan.',
            },
      });
      if (done) this.showSuccessConfetti(100);
      setTimeout(() => onUpdatePlan(), 3000);
    } catch (e) {
      Helpers.createToast(e);
      this.setState({
        loadingYes: false,
        loadingNo: false,
      });
      onUpdatePlan();
    }
  };

  readyToCheckIn = (ready) => {
    const that = this;
    const { note } = this.state;
    const { plan, isMobile } = this.props;
    if (ready) this.setState({ loadingYes: true });
    else this.setState({ loadingNo: true });
    DashboardService.CheckReadyEvent(plan.pk, note, ready)
      .then((data) => {
        // Helpers.createToast(data);
        that.setState({
          checked_ready: true,
          ready,
          loadingYes: false,
          loadingNo: false,
          xp_gained: data.xp,
        });
        setTimeout(() => that.props.onUpdatePlan(), 3000);
        TrackEvent(ready ? 'dash-intention-yes' : 'dash-intention-no');
        if (note) {
          TrackEvent('dash-note');
        }
        const config = configs[ready ? 'yesOptions' : 'noOptions'];
        if (!ready) {
          const end = Date.now() + 5 * 100;
          (function frame() {
            confetti({
              ...config,
              origin: {
                x: Math.random(),
                y: Math.random() - 0.2,
              },
            });
            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          })();
        } else {
          setTimeout(() => {
            confetti({
              ...config,
              origin: {
                y: isMobile ? 0.45 : 0.6,
                x: isMobile ? 0.45 : 0.75,
              },
            });
          }, 250);
        }
      })
      .catch((data) => {
        Helpers.createToast(data);
        that.setState({
          loadingYes: false,
          loadingNo: false,
        });
        that.props.onUpdatePlan();
      });
  };

  onNavigateSliderPrev = () => {
    const { onNavigateSlider } = this.props;
    onNavigateSlider('prev');
    this.setState({ transitionClass: 'd-prev' });
    setTimeout(() => {
      this.setState({ transitionClass: '' }, this.setFocusOnPrompts);
    }, 500);
  };

  setFocusOnPrompts = () => {
    const { plan } = this.props;

    let canCheckIn = plan.can_check_in;
    if (plan.challenge_type === 'Flexible') {
      const checkInWindowEnd = moment(plan.start_date)
        .set('second', 0)
        .add(Number(plan.session_duration) + 60 * 24, 'minutes');

      canCheckIn =
        moment() >= moment(plan.start_date) &&
        moment().isBefore(checkInWindowEnd);
    }

    const endDate = moment(plan.start_date).add(
      plan.session_duration,
      'minutes'
    );
    const hasEnd = endDate.isBefore(moment(), 'seconds');
    if (canCheckIn && hasEnd) {
      const { prompts, generalNoteRef, promptsInputsRefs } = this.state;
      if (prompts.length === 0 && generalNoteRef.current)
        generalNoteRef.current.focus();
      else if (promptsInputsRefs[0].current) {
        promptsInputsRefs[0].current.focus();
      }
    }
  };

  onNavigateSliderNext = () => {
    const { onNavigateSlider } = this.props;
    onNavigateSlider('next');
    this.setState({ transitionClass: 'd-next' });
    setTimeout(() => {
      this.setState({ transitionClass: '' }, this.setFocusOnPrompts);
    }, 500);
  };

  handleToggleAccordion = (e, { index }) => {
    const {
      activeAccordionIndex,
      generalNoteRef,
      promptsInputsRefs,
    } = this.state;
    const newIndex = activeAccordionIndex === index ? -1 : index;
    this.setState({ activeAccordionIndex: newIndex }, () => {
      if (
        newIndex >= 0 &&
        newIndex < promptsInputsRefs.length &&
        promptsInputsRefs[newIndex].current
      ) {
        promptsInputsRefs[newIndex].current.focus();
      } else if (generalNoteRef.current) {
        generalNoteRef.current.focus();
      }
    });
  };

  onChangePrompts = (value, index) => {
    this.setState((prevState) => {
      const prompts = [...prevState.prompts];
      prompts[index].promptValue = value;
      return { prompts };
    });
  };

  onPromptKeyDown = (e) => {
    const tabPressed = e.which === 9 || e.keyCode === 9;
    const enterPressed = e.which === 13 || e.keyCode === 13;
    if (enterPressed) {
      e.preventDefault();
      this.checkInAfterCompletingEvent();
    } else if (tabPressed) {
      e.preventDefault();
      const {
        activeAccordionIndex,
        generalNoteRef,
        promptsInputsRefs,
      } = this.state;
      const newIndex = activeAccordionIndex + 1;
      if (newIndex <= promptsInputsRefs.length) {
        this.setState({ activeAccordionIndex: newIndex }, () => {
          if (
            newIndex < promptsInputsRefs.length &&
            promptsInputsRefs[newIndex].current
          ) {
            promptsInputsRefs[newIndex].current.focus();
          } else if (generalNoteRef.current) {
            generalNoteRef.current.focus();
          }
        });
      }
    }
  };

  onLeave = async () => {
    const { leaveChallenge, onUpdatePlan, user, deletePlan, plan } = this.props;
    deletePlan(plan.plan_id, true);
    if (user.pk !== plan.challenge_creator.id) {
      await leaveChallenge(plan.challenge_id);
      onUpdatePlan();
    } else {
      toast.success('Successfully left Challenge.');
      onUpdatePlan();
    }
  };

  renderPast() {
    const { plan, canNavigateNext, canNavigatePrev, onReschedule } = this.props;
    const {
      completionPercentage,
      prompts,
      note,
      checkInView,
      loadingYes,
      promptsInputsRefs,
      generalNoteRef,
      transitionClass,
      activeAccordionIndex,
    } = this.state;
    const endDate = moment(plan.start_date)
      .set('second', 0)
      .add(plan.session_duration, 'minutes');
    const hasEnd = endDate.isBefore(moment(), 'seconds');
    const addFlashAnimation = endDate.diff(moment(), 'seconds') < 60;
    const countDownClasses = cx('countdown mb-4', { flash: addFlashAnimation });
    const canShowTimeLeft = !checkInView && !hasEnd;
    const generalPromptIndex = prompts.length;
    const isFlashChallenge =
      plan.challenge_id && plan.challenge_type === 'Flash';
    const canRescheduleFlex =
      plan.can_change_time !== 'no' && !isFlashChallenge;
    const canReschedule = !plan.challenge_id || canRescheduleFlex;

    return (
      <div className={cx('checkin', { relative: !!transitionClass })}>
        <div
          className={cx(
            'w-full slider',
            { absolute: !!transitionClass },
            transitionClass
          )}
        >
          <div className={`heading ${plan.habit.category.slug}`}>
            {checkInView || !canShowTimeLeft ? 'CHECK IN' : 'Ongoing now!'}
          </div>
          {canShowTimeLeft ? (
            <div className="time-left-container">
              <span className="time-left">Time left:</span>
              <div className={countDownClasses}>
                <Countdown
                  date={endDate.clone().format()}
                  renderer={Counter}
                  onComplete={() => this.setState({ checkInView: true })}
                />
              </div>
              <div className="mb-8 mt-12">
                {canReschedule && (
                  <Button basic className="mr-4" onClick={onReschedule}>
                    Reschedule
                  </Button>
                )}
                <Button
                  basic
                  color="orange"
                  onClick={() => this.setState({ checkInView: true })}
                >
                  Check In Now
                </Button>
              </div>
            </div>
          ) : (
            <div className={cx('flex-1 w-full text-center')}>
              <div className="checkin-status">How much did you do?</div>
              <div className="slider-container">
                <div className="slider-component">
                  <Slider
                    value={completionPercentage}
                    min={0}
                    max={100}
                    step={1}
                    onChange={this.onSliderChange}
                  />
                </div>
                <div className="slider-percentage">{completionPercentage}%</div>
              </div>
              <Accordion>
                {prompts.map(({ prompt }, index) => (
                  <div>
                    <Accordion.Title
                      active={activeAccordionIndex === index}
                      index={index}
                      onClick={this.handleToggleAccordion}
                    >
                      <Icon
                        name={
                          activeAccordionIndex === index
                            ? 'angle up'
                            : 'angle down'
                        }
                      />
                      {prompt}
                    </Accordion.Title>
                    <Accordion.Content active={activeAccordionIndex === index}>
                      <TextareaAutosize
                        autoFocus
                        style={{
                          resize: 'none',
                        }}
                        placeholder="Enter your note..."
                        value={prompts[index].promptValue || ''}
                        onKeyDown={this.onPromptKeyDown}
                        ref={promptsInputsRefs[index]}
                        onChange={(event) =>
                          this.onChangePrompts(event.target.value, index)
                        }
                      />
                    </Accordion.Content>
                  </div>
                ))}
                <div>
                  <Accordion.Title
                    active={activeAccordionIndex === generalPromptIndex}
                    index={generalPromptIndex}
                    onClick={this.handleToggleAccordion}
                  >
                    <Icon
                      name={
                        activeAccordionIndex === generalPromptIndex
                          ? 'angle up'
                          : 'angle down'
                      }
                    />
                    General note
                  </Accordion.Title>
                  <Accordion.Content
                    active={activeAccordionIndex === generalPromptIndex}
                  >
                    <TextareaAutosize
                      autoFocus
                      style={{ resize: 'none' }}
                      placeholder={
                        prompts.length
                          ? 'Enter your note'
                          : 'What did you do... How do you feel about it... '
                      }
                      value={note || ''}
                      onKeyDown={this.onPromptKeyDown}
                      ref={generalNoteRef}
                      onChange={(event) =>
                        this.setState({ note: event.target.value })
                      }
                    />
                  </Accordion.Content>
                </div>
              </Accordion>
              <div className="checkin-done-holder">
                <div className="step-left">
                  <Icon
                    name="big angle left"
                    className={cx('d-block', { hide: !canNavigatePrev })}
                    {...(canNavigatePrev && {
                      onClick: this.onNavigateSliderPrev,
                    })}
                  />
                </div>
                <Button
                  color="orange"
                  className="checkin-done"
                  type="button"
                  loading={loadingYes}
                  onClick={this.checkInAfterCompletingEvent}
                >
                  <Icon name="check" />
                </Button>
                <div className="step-right">
                  <Icon
                    name="big angle right"
                    className={cx('d-block', { hide: !canNavigateNext })}
                    {...(canNavigateNext && {
                      onClick: this.onNavigateSliderNext,
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {!!transitionClass && (
          <div className="w-full">
            <div className={`heading ${plan.habit.category.slug}`}>
              CHECK IN
            </div>
            <div className={cx('flex-1 w-full text-center')}>
              <div className="checkin-status">How much did you do?</div>
              <div className="slider-container">
                <div className="slider-component">
                  <Slider
                    value={completionPercentage}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div className="slider-percentage">{completionPercentage}%</div>
              </div>
              <Accordion>
                {prompts.map(({ prompt }, index) => (
                  <div>
                    <Accordion.Title
                      active={activeAccordionIndex === index}
                      index={index}
                    >
                      <Icon
                        name={
                          activeAccordionIndex === index
                            ? 'angle up'
                            : 'angle down'
                        }
                      />
                      {prompt}
                    </Accordion.Title>
                    <Accordion.Content active={activeAccordionIndex === index}>
                      <TextareaAutosize
                        style={{
                          resize: 'none',
                        }}
                        placeholder="Enter your note..."
                        value={prompts[index].promptValue || ''}
                      />
                    </Accordion.Content>
                  </div>
                ))}
                <div>
                  <Accordion.Title
                    active={activeAccordionIndex === generalPromptIndex}
                    index={generalPromptIndex}
                  >
                    <Icon
                      name={
                        activeAccordionIndex === generalPromptIndex
                          ? 'angle up'
                          : 'angle down'
                      }
                    />
                    General note
                  </Accordion.Title>
                  <Accordion.Content
                    active={activeAccordionIndex === generalPromptIndex}
                  >
                    <TextareaAutosize
                      style={{ resize: 'none' }}
                      placeholder={
                        prompts.length
                          ? 'Enter your note'
                          : 'What did you do... How do you feel about it... '
                      }
                      value={note || ''}
                    />
                  </Accordion.Content>
                </div>
              </Accordion>
              <div className="checkin-done-holder">
                <div className="step-left">
                  <Icon
                    name="big angle left"
                    className={cx('d-block', { hide: !canNavigatePrev })}
                  />
                </div>
                <Button
                  color="orange"
                  className="checkin-done"
                  type="button"
                  loading={loadingYes}
                >
                  <Icon name="check" />
                </Button>
                <div className="step-right">
                  <Icon
                    name="big angle right"
                    className={cx('d-block', { hide: !canNavigateNext })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderFuture() {
    const { plan, onReschedule, leaveLoading, deletePlanLoading } = this.props;
    const { note, loadingNo, loadingYes } = this.state;
    const isFlashChallenge =
      plan.challenge_id && plan.challenge_type === 'Flash';
    const isBtnDisabled =
      deletePlanLoading || leaveLoading || loadingNo || loadingYes;
    const canRescheduleFlex =
      plan.can_change_time !== 'no' && !isFlashChallenge;
    const canReschedule = !plan.challenge_id || canRescheduleFlex;

    return (
      <div className="checkin">
        <div className={`heading ${plan.habit.category.slug}`}>
          ARE YOU READY?
        </div>
        <div className="flex flex-col items-center justify-center w-full flex-1">
          <div className="checkin-status">Do you intend to do your habit?</div>
          {/*
            <div className="countdown">
              <Countdown
                date={plan.start_date}
                renderer={Counter}
                onComplete={() => onUpdatePlan()}
              />
            </div>
          */}
          <TextareaAutosize
            autoFocus
            style={{ resize: 'none' }}
            value={note}
            placeholder="Enter your note..."
            onChange={(event) => this.setState({ note: event.target.value })}
          />
          <div
            className={cx(
              'checkin-button-holder',
              isFlashChallenge ? 'justify-between' : 'justify-center',
              {
                consecutive:
                  !!plan.challenge_id && plan.challenge_type !== 'Flash',
              }
            )}
          >
            {isFlashChallenge && (
              <Button
                basic
                onClick={this.onLeave}
                disabled={isBtnDisabled}
                loading={leaveLoading || deletePlanLoading}
              >
                Leave Challenge
              </Button>
            )}
            {canReschedule && (
              <Button basic onClick={onReschedule} disabled={isBtnDisabled}>
                Reschedule
              </Button>
            )}
            <Button
              basic
              color="orange"
              onClick={() => this.readyToCheckIn(false)}
              loading={loadingNo}
              disabled={isBtnDisabled}
            >
              No
            </Button>
            <Button
              color="orange"
              loading={loadingYes}
              disabled={isBtnDisabled}
              onClick={() => this.readyToCheckIn(true)}
            >
              Yes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderMilestone() {
    const { plan } = this.props;
    const { loadingNo, loadingYes, milestoneResponse } = this.state;
    return (
      <div className="checkin">
        <div className={`heading ${plan.habit.category.slug}`}>CHECK IN</div>
        <div className="flex flex-col items-center justify-center w-full flex-1">
          {milestoneResponse ? (
            <div>
              <div className="checkin-status title">
                {milestoneResponse.title}
              </div>
              <div className="checkin-status">
                {milestoneResponse.description}
              </div>
            </div>
          ) : (
            <>
              <div className="milestone-title">Milestone</div>
              <div className="milestone-text">{plan.milestone}</div>
              <div className="milestone-description">
                Did you achieve this milestone?
              </div>
              <div className="milestone-buttons checkin-button-holder justify-around mt-4">
                <Button
                  onClick={() => this.onTrackMilestone(false)}
                  loading={loadingNo}
                  disabled={loadingYes || loadingNo}
                >
                  No
                </Button>
                <Button
                  color="orange"
                  onClick={() => this.onTrackMilestone(true)}
                  loading={loadingYes}
                  disabled={loadingYes || loadingNo}
                >
                  Yes
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  render() {
    const {
      milestoneView,
      checked_in: checkedIn,
      checked_ready: checkedReady,
      completionPercentage,
    } = this.state;
    const { plan } = this.props;

    let canCheckIn = plan.can_check_in;
    let canCheckReady = plan.can_check_ready;

    if (plan && plan.challenge_type === 'Flexible') {
      canCheckIn = moment() >= moment(plan.start_date);
      canCheckReady = moment() >= moment(plan.can_check_ready_from);
    }

    if (milestoneView) {
      return this.renderMilestone();
    }
    if (checkedIn || checkedReady) {
      return (
        <div className="checkin">
          <div className={`heading ${plan.habit.category.slug}`}>
            {completionPercentage === 0 ? 'No Problem!' : 'Well Done!'}
          </div>
          <div className="checkin-heading">{this.getCheckedInMessage()}</div>
        </div>
      );
    }
    if (canCheckIn) {
      return this.renderPast();
    }
    if (canCheckReady && !plan.intention_date) {
      return this.renderFuture();
    }
    return null;
  }
}

CheckIn.propTypes = {
  history: PropTypes.shape(),
  match: PropTypes.shape({}).isRequired,
  isMobile: PropTypes.bool,
  onNavigateSlider: PropTypes.func,
  onUpdatePlan: PropTypes.func,
  trackMilestone: PropTypes.func,
  canNavigateNext: PropTypes.bool,
  deletePlan: PropTypes.func,
  leaveLoading: PropTypes.bool,
  leaveChallenge: PropTypes.func,
  deletePlanLoading: PropTypes.bool,
  canNavigatePrev: PropTypes.bool,
  plan: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  progress: PropTypes.number,
  onReschedule: PropTypes.func,
};

const ConnectedCheckIn = connect(null, {
  trackMilestone: trackMilestoneAction,
})(CheckIn);

function CheckInCountDown({
  plan,
  canNavigatePrev,
  onReschedule,
  canNavigateNext,
  onNavigateSlider,
  onUpdatePlan,
  leaveLoading,
  user,
  deletePlan,
  leaveChallenge,
  deletePlanLoading,
}) {
  const [transitionClass, setTransitionClass] = useState('');
  // Seconds set to 0 to sync perfectly with system time
  const endDate = moment(plan.start_date).set('second', 0);
  const addFlashAnimation = endDate.diff(moment(), 'seconds') < 60;
  const countDownClasses = cx('countdown', { flash: addFlashAnimation });
  const loadingLeave = leaveLoading || deletePlanLoading;
  const isFlashChallenge = plan.challenge_id && plan.challenge_type === 'Flash';
  const canRescheduleFlex = plan.can_change_time !== 'no' && !isFlashChallenge;
  const canReschedule = !plan.challenge_id || canRescheduleFlex;

  function onNavigateSliderPrev() {
    onNavigateSlider('prev');
    setTransitionClass('d-prev');
    setTimeout(() => {
      setTransitionClass('');
    }, 500);
  }

  function onNavigateSliderNext() {
    onNavigateSlider('next');
    setTransitionClass('d-next');
    setTimeout(() => {
      setTransitionClass('');
    }, 500);
  }
  async function onLeave() {
    deletePlan(plan.plan_id, true);
    if (user.pk !== plan.challenge_creator.id) {
      await leaveChallenge(plan.challenge_id);
      onUpdatePlan();
    } else {
      toast.success('Successfully left Challenge.');
      onUpdatePlan();
    }
  }
  return (
    <div className={cx('checkin', { relative: !!transitionClass })}>
      <div
        className={cx(
          'w-full slider h-full flex-col flex justify-between flex-1',
          { absolute: !!transitionClass },
          transitionClass
        )}
      >
        <div className={`heading ${plan.habit.category.slug}`}>Starts in:</div>
        <div className={countDownClasses}>
          <Countdown
            date={endDate.clone().format()}
            renderer={Counter}
            onComplete={() => {
              onUpdatePlan();
            }}
          />
        </div>
        <div className="mb-8 checkin-done-holder">
          <div className="step-left">
            <Icon
              name="big angle left"
              className={cx('d-block', { hide: !canNavigatePrev })}
              {...(canNavigatePrev && { onClick: onNavigateSliderPrev })}
            />
          </div>
          {plan.challenge_id && plan.challenge_type === 'Flash' && (
            <Button
              basic
              onClick={onLeave}
              disabled={loadingLeave}
              loading={loadingLeave}
            >
              Leave Challenge
            </Button>
          )}
          {canReschedule && (
            <Button basic onClick={onReschedule}>
              Reschedule
            </Button>
          )}
          <div className="step-right">
            <Icon
              name="big angle right"
              className={cx('d-block', { hide: !canNavigateNext })}
              {...(canNavigateNext && { onClick: onNavigateSliderNext })}
            />
          </div>
        </div>
      </div>
      {!!transitionClass && (
        <div className="w-full h-full flex-col flex justify-between flex-1">
          <div className={`heading ${plan.habit.category.slug}`}>
            Starts in:
          </div>
          <div className={countDownClasses}>
            <Countdown date={endDate.clone().format()} renderer={Counter} />
          </div>
          <div className="mb-8 flex checkin-done-holder">
            <div className="step-left">
              <Icon
                name="big angle left"
                className={cx('d-block', { hide: !canNavigatePrev })}
                {...(canNavigatePrev && { onClick: onNavigateSliderPrev })}
              />
            </div>
            {plan.challenge_id && plan.challenge_type === 'Flash' && (
              <Button
                basic
                onClick={onLeave}
                disabled={loadingLeave}
                loading={loadingLeave}
              >
                Leave Challenge
              </Button>
            )}
            {canReschedule && (
              <Button basic onClick={onReschedule}>
                Reschedule
              </Button>
            )}
            <div className="step-right">
              <Icon
                name="big angle right"
                className={cx('d-block', { hide: !canNavigateNext })}
                {...(canNavigateNext && { onClick: onNavigateSliderNext })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CheckInCountDown.propTypes = {
  plan: PropTypes.shape().isRequired,
  onUpdatePlan: PropTypes.func.isRequired,
  onNavigateSlider: PropTypes.func,
  canNavigateNext: PropTypes.bool,
  onReschedule: PropTypes.func,
  canNavigatePrev: PropTypes.bool,
  deletePlan: PropTypes.func,
  user: PropTypes.shape(),
  leaveLoading: PropTypes.bool,
  leaveChallenge: PropTypes.func,
  deletePlanLoading: PropTypes.bool,
};

function EventCheckIn({ plan, onUpdatePlan, ...props }) {
  if (plan) {
    let canCheckIn = plan.can_check_in;
    let canCheckReady = plan.can_check_ready;

    if (plan.challenge_type === 'Flexible') {
      const checkInWindowEnd = moment(plan.start_date)
        .set('second', 0)
        .add(Number(plan.session_duration) + 60 * 24, 'minutes');

      canCheckIn =
        moment() >= moment(plan.start_date) &&
        moment().isBefore(checkInWindowEnd);
      canCheckReady = moment() >= moment(plan.can_check_ready_from);
    }

    if (canCheckIn || (canCheckReady && !plan.intention_date)) {
      return (
        <ConnectedCheckIn plan={plan} onUpdatePlan={onUpdatePlan} {...props} />
      );
    }
  }
  if (plan !== undefined) {
    return (
      <CheckInCountDown plan={plan} onUpdatePlan={onUpdatePlan} {...props} />
    );
  }
  return (
    <div className="checkin nothing">
      <div className="heading">CHECK IN</div>
      <div className="flex flex-1">
        <Link to="/plan" onClick={() => TrackEvent('dash-schedule-plan')}>
          <Button color="orange">Make a Plan</Button>
        </Link>
      </div>
    </div>
  );
}

EventCheckIn.propTypes = {
  plan: PropTypes.shape().isRequired,
  onUpdatePlan: PropTypes.func.isRequired,
  onNavigateSlider: PropTypes.func,
  canNavigateNext: PropTypes.bool,
  canNavigatePrev: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  leaveLoading: getLoadingLeaveChallenge(state),
  deletePlanLoading: getDeletePlanLoading(state),
});
export default compose(
  connect(mapStateToProps, {
    leaveChallenge: leaveChallengeAction,
    deletePlan: deletePlanAction,
  }),
  withRouter,
  withSizes(({ width }) => ({ isMobile: width < 768 }))
)(EventCheckIn);
