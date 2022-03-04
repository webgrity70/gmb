/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import { TextInput } from '../../ReduxForm';
import './Website.scss';

const bem = BEMHelper({ name: 'DescriptionWebsite', outputIsString: true });

function Website() {
  const [show, setShow] = useState(false);
  return (
    <div className={bem()}>
      <div className={bem('trigger')} onClick={() => setShow(!show)}>
        <Icon name={`${show ? 'minus' : 'plus'} circle`} />
        <span>{show ? 'Hide' : 'Show'} challenge website</span>
      </div>
      {show && (
        <>
          <TextInput
            name="website"
            label="Website"
            placeholder="http://www.MyOrg.com"
          />
        </>
      )}
    </div>
  );
}

export default Website;
