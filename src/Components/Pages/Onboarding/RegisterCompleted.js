import React from 'react';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import mailSentImage from '../../../Assets/images/mail-sent.png';
import './RegisterCompleted.scss';

const bem = BEMHelper({ name: 'RegisterCompleted', outputIsString: true });

const RegisterCompleted = () => (
  <div className={bem()}>
    <div className={cx(bem('container'), 'flex flex-col items-center')}>
      <img className={bem('sent-img')} src={mailSentImage} alt="Mail Sent" />
      <h3 className={cx(bem('title'), 'mb-8')}>
        Congratulations, you&apos;re almost there...
      </h3>
      <p className={bem('description')}>
        Check your inbox for a confirmation email. Click the button in your
        email and you&apos;ll be good to go!
      </p>
      <div className={bem('help-divider')} />
      <h4 className={bem('subtitle')}>Can&apos;t find the email? Try:</h4>
      <ul className={bem('help-list')}>
        <li>Checking the spam folder.</li>
        <li>
          {'Contact us at '}
          <a href="mailto:support@getmotivatedbuddies.com">
            support@getmotivatedbuddies.com
          </a>
          .
        </li>
      </ul>
    </div>
  </div>
);

export default RegisterCompleted;
