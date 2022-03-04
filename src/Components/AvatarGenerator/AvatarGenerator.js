/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Checkbox } from 'semantic-ui-react';
import Slider from 'react-slick';
import ajax from '../../Services/BuddyAvatarService';
import { saveUserAvatar as saveUserAvatarAction } from '../../Actions/actions_user';
import { ReactComponent as Arms } from '../../Assets/images/avatar-generator/arms.svg';
import { ReactComponent as Legs } from '../../Assets/images/avatar-generator/legs.svg';
import './AvatarGenerator.scss';

class AvatarGenerator extends Component {
  constructor(props) {
    /** Props passed
     * @param props.finishUpdatingAvatar
     * @param props.defaultAvatar */
    super(props);
    this.state = {
      avatar: {
        status: false,
        body: null,
        eyes: null,
        back_hair: null,
        front_hair: null,
        mouth: null,
        body_color: [
          '#ed6b7a',
          '#ba68c8',
          '#ffd600',
          '#3cd6ab',
          '#ff8833',
          '#40c4ff',
        ],
        selected_body_color: 0,
        hair_color_type: 'dark',
        hair_color_light_options: {
          '#ed6b7a': 'f6b5bc',
          '#ba68c8': 'dcb3e3',
          '#ffd600': 'dfca60',
          '#3cd6ab': '9dead5',
          '#ff8833': 'ffc399',
          '#40c4ff': '9fe1ff',
        },
        hair_color_dark_options: {
          '#ed6b7a': '974947',
          '#ba68c8': '7c5383',
          '#ffd600': '9f8a20',
          '#3cd6ab': '3d8a75',
          '#ff8833': '9f6339',
          '#40c4ff': '3f819f',
        },
      },
      settings: {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    };
  }

  UNSAFE_componentWillMount() {
    this._mounted = true;
  }

  componentDidMount() {
    const that = this;
    ajax
      .getAvatarElements()
      .then((data) => {
        const avatar_body = data.body;
        const avatar_body_slider = avatar_body.map((ab) => (
          <div className="body_container" data-selected-id={ab.pk} key={ab.pk}>
            <ReactSVG src={ab.fields.image_url} />
          </div>
        ));

        const avatar_eyes = data.eyes;
        const avatar_eyes_slider = avatar_eyes.map((ae) => (
          <div data-selected-id={ae.pk} key={ae.pk}>
            <ReactSVG src={ae.fields.image_url} />
          </div>
        ));

        const avatar_hair = data.hair;
        const avatar_back_hair_slider = avatar_hair.map((ah) => (
          <div data-selected-id={ah.pk} key={ah.pk}>
            <ReactSVG src={ah.fields.back_image_url} />
          </div>
        ));

        const avatar_front_hair_slider = avatar_hair.map((ah) => (
          <div key={ah.pk}>
            <ReactSVG src={ah.fields.front_image_url} />
          </div>
        ));

        const avatar_mouth = data.mouth;
        const avatar_mouth_slider = avatar_mouth.map((am) => (
          <div data-selected-id={am.pk} key={am.pk}>
            <ReactSVG src={am.fields.image_url} />
          </div>
        ));
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) {
          const dark_hair_match = Object.keys(
            that.state.avatar.hair_color_dark_options
          ).filter(
            (key) =>
              that.state.avatar.hair_color_dark_options[key] ===
              that.props.defaultAvatar.hair_color
          );
          that.setState({
            avatar: {
              status: true,
              body: avatar_body_slider,
              eyes: avatar_eyes_slider,
              back_hair: avatar_back_hair_slider,
              front_hair: avatar_front_hair_slider,
              mouth: avatar_mouth_slider,
              body_color: [
                '#ed6b7a',
                '#ba68c8',
                '#ffd600',
                '#3cd6ab',
                '#ff8833',
                '#40c4ff',
              ],
              selected_body_color: that.state.avatar.body_color.findIndex(
                (hair) => hair === `#${that.props.defaultAvatar.body_color}`
              ),
              hair_color_type: dark_hair_match.length > 0 ? 'dark' : 'light',
              hair_color_light_options: {
                '#ed6b7a': 'f6b5bc',
                '#ba68c8': 'dcb3e3',
                '#ffd600': 'dfca60',
                '#3cd6ab': '9dead5',
                '#ff8833': 'ffc399',
                '#40c4ff': '9fe1ff',
              },
              hair_color_dark_options: {
                '#ed6b7a': '974947',
                '#ba68c8': '7c5383',
                '#ffd600': '9f8a20',
                '#3cd6ab': '3d8a75',
                '#ff8833': '9f6339',
                '#40c4ff': '3f819f',
              },
            },
          });
          that.setBodyColor(
            parseInt(
              Object.keys(that.state.avatar.body_color).filter(
                (i) =>
                  that.state.avatar.body_color[i] ===
                  `#${that.props.defaultAvatar.body_color}`
              )[0],
              10
            )
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleHairColorChange = (e, { value }) => {
    const { avatar } = this.state;
    this.setState({
      avatar: {
        ...avatar,
        hair_color_type: value.toLowerCase(),
      },
    });
  };

  setBodyColor = (color) => {
    const { avatar } = this.state;
    this.setState({ avatar: { ...avatar, selected_body_color: color } });
  };

  save = () => {
    const that = this;

    const body = document
      .querySelector('#body-slider .slick-active div[data-selected-id]')
      .getAttribute('data-selected-id');

    const eyes = document
      .querySelector('#eyes-slider .slick-active div[data-selected-id]')
      .getAttribute('data-selected-id');

    const mouth = document
      .querySelector('#mouth-slider .slick-active div[data-selected-id]')
      .getAttribute('data-selected-id');

    const hair = document
      .querySelector('#backhair-slider .slick-active div[data-selected-id]')
      .getAttribute('data-selected-id');
    that.props
      .saveUserAvatar({
        body,
        eyes,
        mouth,
        hair,
        body_color:
          that.state.avatar.body_color[that.state.avatar.selected_body_color],
        hair_color:
          that.state.avatar.hair_color_type === 'dark'
            ? `#${
                that.state.avatar.hair_color_dark_options[
                  that.state.avatar.body_color[
                    that.state.avatar.selected_body_color
                  ]
                ]
              }`
            : `#${
                that.state.avatar.hair_color_light_options[
                  that.state.avatar.body_color[
                    that.state.avatar.selected_body_color
                  ]
                ]
              }`,
      })
      .then(() => {
        if (that.props.updateUser) {
          that.props.updateUser(null);
        }
        if (that.props.onSave) {
          that.props.onSave();
        }
        that.props.finishUpdatingAvatar();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  nextHair = () => {
    this.back_hair_slider.slickNext();
    this.front_hair_slider.slickNext();
  };

  prevHair = () => {
    this.back_hair_slider.slickPrev();
    this.front_hair_slider.slickPrev();
  };

  nextBody = () => {
    this.body_slider.slickNext();
  };

  prevBody = () => {
    this.body_slider.slickPrev();
  };

  nextEyes = () => {
    this.eyes_slider.slickNext();
  };

  prevEyes = () => {
    this.eyes_slider.slickPrev();
  };

  nextMouth = () => {
    this.mouth_slider.slickNext();
  };

  prevMouth = () => {
    this.mouth_slider.slickPrev();
  };

  render() {
    const { avatar, settings } = this.state;
    const { finishUpdatingAvatar, defaultAvatar } = this.props;
    if (!avatar.status) {
      return <div />;
    }
    return (
      <div id="avatar-generator">
        <div className="buddy">
          <Arms style={{ position: 'absolute', top: 0, left: 0 }} />
          <Legs style={{ position: 'absolute', top: 0, left: 0 }} />
          <div
            className={`avatar-slider hair-fill-${
              avatar.selected_body_color + 1
            } ${avatar.hair_color_type}`}
            id="backhair-slider"
          >
            <Slider
              arrows={false}
              ref={(c) => (this.back_hair_slider = c)}
              initialSlide={avatar.back_hair.findIndex(
                (obj) =>
                  obj.props.children.props.src ===
                  defaultAvatar.hair.back_image_url
              )}
              {...settings}
            >
              {avatar.back_hair}
            </Slider>
          </div>
          <div
            className={`avatar-slider body-fill-${
              avatar.selected_body_color + 1
            }`}
            id="body-slider"
          >
            <Slider
              arrows={false}
              ref={(c) => (this.body_slider = c)}
              {...settings}
              initialSlide={avatar.body.findIndex(
                (obj) =>
                  obj.props.children.props.src === defaultAvatar.body.image_url
              )}
            >
              {avatar.body}
            </Slider>
          </div>
          <div className="avatar-slider" id="eyes-slider">
            <Slider
              {...settings}
              ref={(c) => (this.eyes_slider = c)}
              arrows={false}
              initialSlide={avatar.eyes.findIndex(
                (obj) =>
                  obj.props.children.props.src === defaultAvatar.eyes.image_url
              )}
            >
              {avatar.eyes}
            </Slider>
          </div>
          <div
            className={`avatar-slider hair-fill-${
              avatar.selected_body_color + 1
            } ${avatar.hair_color_type}`}
            id="fronthair-slider"
          >
            <Slider
              ref={(c) => (this.front_hair_slider = c)}
              arrows={false}
              {...settings}
              initialSlide={avatar.front_hair.findIndex(
                (obj) =>
                  obj.props.children.props.src ===
                  defaultAvatar.hair.front_image_url
              )}
            >
              {avatar.front_hair}
            </Slider>
          </div>
          <div className="avatar-slider" id="mouth-slider">
            <Slider
              {...settings}
              ref={(c) => (this.mouth_slider = c)}
              arrows={false}
              initialSlide={avatar.mouth.findIndex(
                (obj) =>
                  obj.props.children.props.src === defaultAvatar.mouth.image_url
              )}
            >
              {avatar.mouth}
            </Slider>
          </div>
        </div>
        <div className="right-content">
          <div className="slider-changes">
            <div className="slider-item">
              <button
                type="button"
                onClick={this.prevBody}
                className="slick-custom-prev"
              >
                Previous
              </button>
              <div className="selector-title">Body</div>
              <button
                type="button"
                onClick={this.nextBody}
                className="slick-custom-next"
              >
                Next
              </button>
            </div>
            <div className="slider-item">
              <button
                type="button"
                onClick={this.prevEyes}
                className="slick-custom-prev"
              >
                Previous
              </button>
              <div className="selector-title">Eyes</div>
              <button
                type="button"
                onClick={this.nextEyes}
                className="slick-custom-next"
              >
                Next
              </button>
            </div>
            <div className="slider-item">
              <button
                type="button"
                onClick={this.prevHair}
                className="slick-custom-prev"
              >
                Previous
              </button>
              <div className="selector-title">Hair</div>
              <button
                type="button"
                onClick={this.nextHair}
                className="slick-custom-next"
              >
                Next
              </button>
            </div>
            <div className="slider-item">
              <button
                type="button"
                onClick={this.prevMouth}
                className="slick-custom-prev"
              >
                Previous
              </button>
              <div className="selector-title">Mouth</div>
              <button
                type="button"
                onClick={this.nextMouth}
                className="slick-custom-next"
              >
                Next
              </button>
            </div>
          </div>
          <div className="body-color-picker">
            <h4>Pick a body color</h4>
            <div
              onClick={() => this.setBodyColor(0)}
              className={
                avatar.selected_body_color === 0
                  ? 'body-color color1 active'
                  : 'body-color color1'
              }
            />
            <div
              onClick={() => this.setBodyColor(1)}
              className={
                avatar.selected_body_color === 1
                  ? 'body-color color2 active'
                  : 'body-color color2'
              }
            />
            <div
              onClick={() => this.setBodyColor(2)}
              className={
                avatar.selected_body_color === 2
                  ? 'body-color color3 active'
                  : 'body-color color3'
              }
            />
            <div
              onClick={() => this.setBodyColor(3)}
              className={
                avatar.selected_body_color === 3
                  ? 'body-color color4 active'
                  : 'body-color color4'
              }
            />
            <div
              onClick={() => this.setBodyColor(4)}
              className={
                avatar.selected_body_color === 4
                  ? 'body-color color5 active'
                  : 'body-color color5'
              }
            />
            <div
              onClick={() => this.setBodyColor(5)}
              className={
                avatar.selected_body_color === 5
                  ? 'body-color color6 active'
                  : 'body-color color6'
              }
            />
          </div>
          <div className="hair-color-picker">
            <h4>Pick a hair color</h4>
            <Checkbox
              radio
              label="Light"
              value="Light"
              checked={avatar.hair_color_type === 'light'}
              onChange={this.handleHairColorChange}
            />
            <br />
            <Checkbox
              radio
              label="Dark"
              value="Dark"
              checked={avatar.hair_color_type === 'dark'}
              onChange={this.handleHairColorChange}
            />
          </div>
        </div>
        <div className="avatar-generator-buttons">
          <Button onClick={finishUpdatingAvatar}>Cancel</Button>
          <Button onClick={this.save} className="gmb-primary">
            Save
          </Button>
        </div>
      </div>
    );
  }
}

AvatarGenerator.propTypes = {
  finishUpdatingAvatar: PropTypes.func,
  defaultAvatar: PropTypes.shape(),
  saveUserAvatar: PropTypes.func,
};

export default connect(null, { saveUserAvatar: saveUserAvatarAction })(
  AvatarGenerator
);
