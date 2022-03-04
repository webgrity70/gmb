import React from 'react';

import Avatar from '../../Elements/Avatar';

import './AvatarWrapper.scss';

import BEMHelper from 'react-bem-helper';
const bem = BEMHelper({ name: 'AvatarWrapper', outputIsString: true });

// provide EITHER raw avatar data OR an img url, not both
const AvatarWrapper = ({ avatar, url }) => {
  return (
    <div className={bem('avatar')}>
      {url && (
        <img style={{ width: '47px', height: '47px' }} src={url} alt={'icon'} />
      )}
      {avatar && <Avatar avatar={avatar} />}
    </div>
  );
};

export default AvatarWrapper;
