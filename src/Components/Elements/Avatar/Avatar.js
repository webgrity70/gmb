/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { ReactComponent as Arms } from '../../../Assets/images/avatar-generator/arms.svg';
import { ReactComponent as Legs } from '../../../Assets/images/avatar-generator/legs.svg';

import './Avatar.scss';

const Avatar = ({ avatar, id, avatarCallback, canEdit }) => {
  /** Props passed
   * @param avatar.body.image_url
   * @param avatar.eyes.image_url
   * @param avatar.hair.back_image_url
   * @param avatar.hair.front_image_url
   * @param avatar.mouth.image_url
   * @param canEdit
   * @param id
   * @function props.avatarCallback
   * */
  if (
    !avatar ||
    !avatar.hair.back_image_url ||
    !avatar.body.image_url ||
    !avatar.eyes.image_url ||
    !avatar.mouth.image_url
  )
    return <div />;
  const style = {
    position: 'absolute',
    left: '-30%',
    top: '0',
    width: '160%',
    height: '160%',
    pointerEvents: 'none',
  };
  const Wrapper = id ? Link : Fragment;
  return (
    <Wrapper {...(id && { to: `/profile/${id}`, className: 'GMBAvatar' })}>
      <Arms style={style} className="avatar-arms" />
      <Legs style={style} className="avatar-legs" />
      <div className={`svgfill-${avatar.hair_color}`}>
        <ReactSVG
          svgStyle={style}
          src={avatar.hair.back_image_url}
          className="avatar-hair"
        />
      </div>
      <div className={`svgfill-${avatar.body_color}`}>
        <ReactSVG
          svgStyle={style}
          src={avatar.body.image_url}
          className="avatar-body"
        />
      </div>
      <ReactSVG
        svgStyle={style}
        src={avatar.eyes.image_url}
        className="avatar-eyes"
      />
      <ReactSVG
        svgStyle={style}
        src={avatar.mouth.image_url}
        className="avatar-mouth"
      />
      <div className={`svgfill-${avatar.hair_color}`}>
        <ReactSVG
          svgStyle={style}
          src={avatar.hair.front_image_url}
          className="avatar-hair"
        />
      </div>
      {canEdit && (
        <div onClick={avatarCallback} className="edit-avatar clickable">
          <span>
            <Icon name="pencil" color="orange" />
            Edit
          </span>
        </div>
      )}
    </Wrapper>
  );
};

Avatar.propTypes = {
  id: PropTypes.number,
  canEdit: PropTypes.bool,
  avatarCallback: PropTypes.func,
  avatar: PropTypes.shape({
    body: PropTypes.shape({
      image_url: PropTypes.string,
    }),
    eyes: PropTypes.shape({
      image_url: PropTypes.string,
    }),
    mouth: PropTypes.shape({
      image_url: PropTypes.string,
    }),
    hair: PropTypes.shape({
      back_image_url: PropTypes.string,
      front_image_url: PropTypes.string,
    }),
  }),
};

export default Avatar;
