import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import { Popup } from 'semantic-ui-react';
import {
  getMyProfileId,
  isNameCompleted,
  getProfilePercentage,
  isBirthdayCompleted,
  isAboutCompleted,
  isFoodCompleted,
  isLocationCompleted,
  isMeetingPreferenceCompleted,
  isOccupationCompleted,
  isWeaknessCompleted,
  areLanguagesCompleted,
  areStrengthCompleted,
} from '../../selectors/profile';
import CircularProgress from '../Elements/ProgressBar';
import './ProfileProgress.scss';

const bem = BEMHelper({ name: 'ProfileProgressBar', outputIsString: true });

const ProfileProgress = ({
  percentage,
  name,
  aboutCompleted,
  foodCompleted,
  locationCompleted,
  meetingPreferenceCompleted,
  languagesCompleted,
  weaknessCompleted,
  occupationCompleted,
  strengthCompleted,
  birthdayCompleted,
  nameCompleted,
  className,
}) => {
  if (percentage >= 99) return null;
  const [open, setOpen] = useState(true);
  const fields = useMemo(() => [
    { label: 'Name', completed: nameCompleted },
    { label: 'Birthday', completed: birthdayCompleted },
    { label: 'Location', completed: locationCompleted },
    { label: 'Languages', completed: languagesCompleted },
    { label: 'About', completed: aboutCompleted },
    { label: 'Occupation', completed: occupationCompleted },
    { label: 'Weakness', completed: weaknessCompleted },
    { label: 'Strength', completed: strengthCompleted },
    { label: 'Favorite food', completed: foodCompleted },
    { label: 'Meeting preference', completed: meetingPreferenceCompleted },
  ]);
  return (
    <div className={bem()}>
      <Popup
        style={{ position: 'fixed', top: '65px', minHeight: '235px' }}
        trigger={
          <CircularProgress
            name={name}
            value={percentage}
            text={`${percentage}%`}
            onClick={() => setOpen(!open)}
          />
        }
        onClose={() => setOpen(false)}
        open={open}
        className={className}
        on="click"
      >
        <div className={bem('fields')}>
          {fields.map((field) => (
            <span
              key={field.label}
              {...(field.completed && { className: bem('fields-block') })}
            >
              {!field.completed ? 'Add' : ''} {field.label}
            </span>
          ))}
        </div>
      </Popup>
    </div>
  );
};

const mapStateToProps = (state) => {
  const myId = getMyProfileId(state);
  const percentage = getProfilePercentage(state, { profileId: myId });
  return {
    percentage: parseInt(percentage, 10),
    aboutCompleted: isAboutCompleted(state, { profileId: myId }),
    foodCompleted: isFoodCompleted(state, { profileId: myId }),
    locationCompleted: isLocationCompleted(state, { profileId: myId }),
    meetingPreferenceCompleted: isMeetingPreferenceCompleted(state, {
      profileId: myId,
    }),
    occupationCompleted: isOccupationCompleted(state, { profileId: myId }),
    weaknessCompleted: isWeaknessCompleted(state, { profileId: myId }),
    languagesCompleted: areLanguagesCompleted(state, { profileId: myId }),
    strengthCompleted: areStrengthCompleted(state, { profileId: myId }),
    birthdayCompleted: isBirthdayCompleted(state, { profileId: myId }),
    nameCompleted: isNameCompleted(state, { profileId: myId }),
  };
};

ProfileProgress.propTypes = {
  percentage: PropTypes.number,
  name: PropTypes.string,
  aboutCompleted: PropTypes.bool,
  foodCompleted: PropTypes.bool,
  locationCompleted: PropTypes.bool,
  meetingPreferenceCompleted: PropTypes.bool,
  occupationCompleted: PropTypes.bool,
  weaknessCompleted: PropTypes.bool,
  languagesCompleted: PropTypes.bool,
  strengthCompleted: PropTypes.bool,
  birthdayCompleted: PropTypes.bool,
  nameCompleted: PropTypes.bool,
  className: PropTypes.string,
};

export default connect(mapStateToProps)(ProfileProgress);
