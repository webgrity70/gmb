import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

class ActivatingCategory extends React.Component {
  render() {
    const { activeCategories, points, onSwitchingTo } = this.props;

    const options = _.map(activeCategories, (category) => ({
      key: category.id,
      text: category.name,
      value: category.id,
    }));

    const handleChange = (e, { value }) => {
      onSwitchingTo(
        _.find(activeCategories, (category) => category.id === value)
      );
    };

    return (
      <div className="content activating">
        <label className="label">To activate this category you must:</label>

        <div className="options">
          <div className="switch">
            <h4> Switch </h4>
            <p className="extra">
              {' '}
              <b> Lose </b> your current <b> Plan and Buddy </b>{' '}
            </p>
            <div className="categories">
              <Dropdown
                onChange={handleChange}
                options={options}
                placeholder="Switch from..."
                selection
                selectOnBlur={false}
              />
            </div>
          </div>

          <div className="level-up">
            <h4> Level Up </h4>
            <p className="extra">
              {' '}
              <b> Reach {points} points </b> in your current category to add
              this one. Meanwhile, earn points here without a Plan{' '}
            </p>
            <div className="action">
              <Link to="/plan/one-off" className="ui button create-event">
                {' '}
                Create Event{' '}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ActivatingCategory;
