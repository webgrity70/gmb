import React from 'react';
import { Button } from 'semantic-ui-react';

import ProfileService from '../../../Services/ProfileService';

class DeletingCategory extends React.Component {
  constructor(props) {
    super(props);

    this.remove = this.remove.bind(this);
  }

  remove() {
    this.setState({ removing: true });
    ProfileService.removeCategory(this.props.category.habit.value).then(
      () => {
        this.props.loadCategories();
        this.props.onRemove(false);
      },
      () => {
        this.setState({ removing: false });
      }
    );
  }

  render() {
    const { buddy, onRemove, disabled } = this.props;
    const { removing } = this.props;

    return (
      <div className="content deleting">
        <p className="text">
          By deactivating this category
          {buddy && (
            <span>
              {' '}
              you will be <b> unmatched from {buddy.name} </b> and{' '}
            </span>
          )}
          <b>
            {' '}
            you will lose access to your current Plan
            {buddy && <span> and Buddy</span>}.{' '}
          </b>
        </p>

        <p className="sure">Are you sure?</p>

        <div className="buttons">
          <Button
            secondary
            disabled={removing || disabled}
            onClick={() => onRemove(false)}
          >
            {' '}
            Cancel{' '}
          </Button>
          <Button primary disabled={removing || disabled} onClick={this.remove}>
            {' '}
            Deactivate{' '}
          </Button>
        </div>
      </div>
    );
  }
}

export default DeletingCategory;
