import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import './EmojiPicker.scss';

const EmojiPicker = ({ onSelect }) => (
  <Popup
    on="click"
    position="top right"
    className="EmojiPicker"
    trigger={<Icon name="smile outline" className="EmojiPicker__icon" />}
  >
    <Picker onSelect={onSelect} include={['people']} />
  </Popup>
);
EmojiPicker.propTypes = {
  onSelect: PropTypes.func,
};

export default EmojiPicker;
