import React, { useContext } from 'react';
import BEMHelper from 'react-bem-helper';
import { Popup, Icon } from 'semantic-ui-react';
// import PlanContext from '../PlanContext';
import Filters from './Filters';
import './Notifications.scss';

export const bem = BEMHelper({
  name: 'PlanNotifications',
  outputIsString: true,
});

const FiltersPopup = ({ challengeId }) => {
  // const {
  //   openNotifications: open,
  //   toggleOpenNotifications: toggleOpen,
  // } = useContext(PlanContext);
  return (
    <Popup
      position="bottom right"
      size="large"
      // open={open}
      // onClose={toggleOpen}
      className={bem()}
      // onOpen={toggleOpen}
      on="click"
      trigger={
        <Icon name="bell" size="large" className="pointer" color="orange" />
      }
    >
      <Filters challengeId={challengeId} />
    </Popup>
  );
};

export default FiltersPopup;
