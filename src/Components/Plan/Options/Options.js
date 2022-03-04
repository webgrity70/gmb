/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Popup, Icon, Button } from 'semantic-ui-react';
import PlanContext from '../PlanContext';
import CopyToClipboard from '../../Elements/CopyToClipboard';
import { timeFormaTypes } from '../utils';
import './Options.scss';
import { VIEWS } from '../Toolbar/utils';

const bem = BEMHelper({ name: 'PlanOptions', outputIsString: true });

const startingTypes = {
  SUNDAY: 0,
  MONDAY: 1,
};

const OptionsPopup = ({ calendarLink }) => {
  const {
    toggleOpenOptions: toggleOpen,
    openOptions: open,
    startingDay,
    onChangeStartingDay,
    timeFormat,
    onChangeTimeFormat,
    onChangeDefaultView,
    defaultView,
  } = useContext(PlanContext);
  return (
    <Popup
      position="bottom right"
      size="large"
      open={open}
      onClose={toggleOpen}
      className={bem()}
      onOpen={toggleOpen}
      on="click"
      trigger={<Icon name="cog" size="large" />}
    >
      <div className={bem('container')}>
        <span>Week start on:</span>
        <div className="flex flex-col">
          <a
            onClick={() => onChangeStartingDay(startingTypes.MONDAY)}
            className={cx({ active: startingTypes.MONDAY === startingDay })}
          >
            Monday
          </a>
          <a
            onClick={() => onChangeStartingDay(startingTypes.SUNDAY)}
            className={cx({ active: startingTypes.SUNDAY === startingDay })}
          >
            Sunday
          </a>
        </div>
        <span>Time format:</span>
        <div className="flex flex-col">
          <a
            onClick={() => onChangeTimeFormat(timeFormaTypes.HALF)}
            className={cx({ active: timeFormaTypes.HALF === timeFormat })}
          >
            12-hour
          </a>
          <a
            onClick={() => onChangeTimeFormat(timeFormaTypes.FULL)}
            className={cx({ active: timeFormaTypes.FULL === timeFormat })}
          >
            24-hour
          </a>
        </div>
        <span>Default View:</span>
        <div className="flex flex-col">
          <a
            onClick={() => onChangeDefaultView(VIEWS.agenda)}
            className={cx({ active: VIEWS.agenda === defaultView })}
          >
            Agenda
          </a>
          <a
            onClick={() => onChangeDefaultView(VIEWS.month)}
            className={cx({ active: VIEWS.month === defaultView })}
          >
            Month
          </a>
          <a
            onClick={() => onChangeDefaultView(VIEWS.week)}
            className={cx({ active: VIEWS.week === defaultView })}
          >
            Week
          </a>
        </div>
        <span>Import calendar:</span>
        <div>
          <CopyToClipboard
            toCopy={calendarLink}
            Success={
              <span className="copied-link">
                Copied to clipboard
                <br />
                <a
                  href="http://help.getmotivatedbuddies.com/en/articles/2810436-importing-gmb-calendar-to-google-calendar-ical-microsoft-outlook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instructions how to use
                </a>
              </span>
            }
          >
            <Button className={bem('add')} color="orange">
              Add to my calendar
            </Button>
          </CopyToClipboard>
        </div>
      </div>
    </Popup>
  );
};

OptionsPopup.propTypes = {
  calendarLink: PropTypes.string,
};

export default OptionsPopup;
