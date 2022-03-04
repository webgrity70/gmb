/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import { Checkbox, Popup } from 'semantic-ui-react';
import FieldSetLayout from '../../ReduxForm/FieldSetLayout';
import { Input } from '../../ReduxForm';
// import EditLocationModal from '../../NewGroup/EditLocationModal';
import './FlashChallengeCheckBoxInput.scss';

const bem = BEMHelper({
  name: 'FlashChallengeCheckBoxInput',
  outputIsString: true,
});

function InnerComp({
  input: { name, onChange, onBlur, value },
  label,
  alwaysActive,
  questionMarkText,
  // currentLocationId,
  ...props
}) {
  /* const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  function onChangeLocation(location) {
    onChange({
      ...value,
      address: {
        ...value.address,
        location: location.formattedAddress,
        placeId: location.placeId,
      },
    });
  }
  const LocationComp = (
    <>
      <div className="mt-3">
        <Checkbox
          label="Set an address for people to search your flash challenge by location"
          name="address.active"
          checked={Boolean(value.address.active)}
          onChange={() => onChange({
            ...value,
            address: { ...value.address, active: Boolean(!value.address.active) },
          })
          }
          className="CheckBoxInput"
        />
        <Popup
          trigger={<i className="far fa-question-circle mt-2 ml-3" />}
          on="click"
          inverted
          hoverable
          className={bem('popup')}
        >
          Please fill out the field with least 3 characters.
        </Popup>
      </div>
      {value.address.active && (
        <>
          <div className={bem('location')}>
            Location: <span>{value.address.location}</span>
            <span onClick={() => setLocationModalOpen(true)}>Edit</span>
          </div>
          <EditLocationModal
            open={isLocationModalOpen}
            onClose={() => setLocationModalOpen(false)}
            onSubmit={onChangeLocation}
            currentLocationId={value.address.placeId || currentLocationId}
          />
        </>
      )}
    </>
  );
 */
  const InputComp = (
    <>
      <Input
        placeholder="e.g., Lose 5 pounds"
        value={value.name}
        onChange={(flashName) => {
          onBlur();
          onChange({ ...value, name: flashName });
        }}
      />
      <div className={bem('legend')}>
        <span>What buddies will see</span>
        <span>{value.name ? value.name.length : 0} / 90</span>
      </div>
    </>
  );
  return (
    <FieldSetLayout {...props}>
      <div className={bem()}>
        {alwaysActive && (
          <>
            <h4 className={bem('label')}>
              What is the name of this flash challenge?
            </h4>
            {InputComp}
          </>
        )}
        {!alwaysActive && (
          <div>
            <Checkbox
              label={label}
              name={name}
              checked={Boolean(value.active)}
              onChange={() =>
                onChange({ ...value, active: Boolean(!value.active) })
              }
              className="CheckBoxInput"
            />
            <Popup
              trigger={<i className="far fa-question-circle mt-2 ml-3" />}
              on="click"
              inverted
              hoverable
              className={bem('popup')}
            >
              {questionMarkText}
            </Popup>
          </div>
        )}
        {value.active && !alwaysActive && (
          <>
            <div className={bem('content')}>
              <div>
                <h4 className={bem('label')}>Flash challenge name</h4>
                {InputComp}
              </div>
            </div>
          </>
        )}
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  label: PropTypes.string,
  alwaysActive: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  questionMarkText: PropTypes.string,
  currentLocationId: PropTypes.string,
};

InnerComp.defaultProps = {
  questionMarkText:
    'Others can join you with in this event from anywhere around the world.',
};

const FlashChallengeCheckBoxInput = (props) => (
  <Field {...props} component={InnerComp} />
);

export default FlashChallengeCheckBoxInput;
