/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import withSizes from 'react-sizes';
import { Icon, Button } from 'semantic-ui-react';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import { VIEWS, getNewPeriod } from './utils';
import './Toolbar.scss';
import usePrevious from '../../../utils/usePrevious';
import Filters from '../Filters';
import Notifications from '../Notifications';

import Options from '../Options';
import PlanContext from '../PlanContext';

const bem = BEMHelper({ name: 'PlanToolbar', outputIsString: true });

const viewsList = [VIEWS.agenda, VIEWS.week, VIEWS.month];

const Toolbar = ({
  date,
  label,
  onNavigate,
  onClickToday,
  isMobile,
  hideSettings,
  handleNewDates,
  onChangeView,
  calendarLink,
}) => {
  const prevDate = usePrevious(`${date}`);
  const { view } = useContext(PlanContext);
  const shouldShowTitle = !isMobile && view !== VIEWS.agenda;
  const shouldShowMobileTitle = isMobile && view !== VIEWS.agenda;
  useEffect(() => {
    if (prevDate && prevDate.toString() !== date.toString()) {
      const newDate = getNewPeriod({ view, date });
      handleNewDates(newDate);
    }
  }, [date, prevDate]);
  function Title() {
    return (
      <div className={bem('title')}>
        <Icon name="chevron left" onClick={() => onNavigate('PREV')} />
        {label}
        <Icon name="chevron right" onClick={() => onNavigate('NEXT')} />
      </div>
    );
  }
  return (
    <div className={cx('flex', 'justify-between', bem())}>
      <div className={cx('flex items-start items-center', bem('views'))}>
        {viewsList.map((e) => (
          <span
            key={e}
            className={cx({ active: view === e })}
            onClick={() => onChangeView(e)}
          >
            {e}
          </span>
        ))}
      </div>
      {shouldShowTitle && <Title />}
      <div className={cx('flex items-center justify-end', bem('settings'))}>
        {!hideSettings && (
          <>
            <Button basic onClick={onClickToday}>
              Today
            </Button>
            <Notifications />
            <Filters />
            <Options calendarLink={calendarLink} />
          </>
        )}
      </div>
      {shouldShowMobileTitle && <Title />}
    </div>
  );
};

Toolbar.propTypes = {
  label: PropTypes.string,
  onNavigate: PropTypes.func,
  date: PropTypes.string,
  hideSettings: PropTypes.bool,
  handleNewDates: PropTypes.func,
  onChangeView: PropTypes.func,
  calendarLink: PropTypes.string,
  isMobile: PropTypes.bool,
  onClickToday: PropTypes.func,
};

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(Toolbar);
