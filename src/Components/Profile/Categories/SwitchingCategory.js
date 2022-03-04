import React from 'react';
import { Button } from 'semantic-ui-react';

const SwitchingCategory = ({
  toCategory,
  buddy,
  fromCategory,
  onSwitchCancel,
  onSwitchCategory,
  disabled,
}) => (
  <div className="content switching">
    <p className="text">
      By switching to {toCategory.name} from {fromCategory.name}
      {buddy && (
        <span>
          {' '}
          you will be unmatched from <b> {buddy.name} </b> and{' '}
        </span>
      )}
      <b> you will lose access to your current Plan and Buddy. </b>
    </p>
    <p className="sure">Are you sure?</p>

    <div className="buttons">
      <Button secondary disabled={disabled} onClick={onSwitchCancel}>
        {' '}
        Cancel{' '}
      </Button>
      <Button primary disabled={disabled} onClick={onSwitchCategory}>
        {' '}
        Yes, Switch!{' '}
      </Button>
    </div>
  </div>
);

export default SwitchingCategory;
