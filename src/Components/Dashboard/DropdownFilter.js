/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

const dropdownMenu = [
  {
    key: 'announcements',
    icon: 'newspaper',
    label: 'Announcements',
    value: 'announcements',
  },
  // {
  //   key: 'challenges',
  //   icon: 'hourglass half',
  //   label: 'Challenges',
  //   value: 'challenges',
  // },
  // {
  //   key: 'flash',
  //   icon: 'bolt',
  //   label: 'Flash challenges',
  //   value: 'flash-challenges',
  // },
  // {
  //   key: 'achievements',
  //   icon: 'certificate',
  //   label: 'Achievements',
  //   value: 'achievements',
  // },
  // {
  //   key: 'group',
  //   icon: 'users',
  //   label: 'Group Announcements',
  //   value: 'group-announcements',
  // },
  {
    key: 'shout-outs',
    icon: 'bullhorn',
    label: 'Shout outs',
    value: 'shout-outs',
  },
  {
    key: 'quotes',
    icon: 'quote right',
    label: 'Quotes',
    value: 'quotes',
  },
  {
    key: 'hints',
    icon: 'info circle',
    label: 'Hints',
    value: 'hints',
  },
];

class DropdownFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
    };
  }

  renderDropdownItems(filter) {
    const { filterItems } = this.props;
    return dropdownMenu.map((item) => (
      <div
        key={item.key}
        className={`item ${filter.includes(item.value) ? 'grey' : ''}`}
        onClick={() => filterItems(item.value)}
      >
        <Icon name={item.icon} />
        <div className="label">{item.label}</div>
      </div>
    ));
  }

  render() {
    const { filter } = this.props;
    return this.renderDropdownItems(filter);
  }
}

export default DropdownFilter;
