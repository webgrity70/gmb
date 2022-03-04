import React from 'react';
import { Button, Dropdown, Form, TextArea } from 'semantic-ui-react';
import _ from 'lodash';

class EditingCategory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newHabit: '',
      goal: '',
      options: _.map(props.category.habits, (habit) => ({
        key: habit.value,
        value: habit.value,
        text: habit.label,
      })),
    };

    this.handleGoalChange = this.handleGoalChange.bind(this);
    this.handleHabitChange = this.handleHabitChange.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
  }

  handleHabitChange(event, { value }) {
    this.setState({ newHabit: value });
  }

  handleGoalChange(event) {
    const { value = '' } = event.target;
    this.setState({ goal: value });
  }

  UNSAFE_componentWillMount() {
    const { category } = this.props;
    this.setState({
      newHabit: _.get(category, 'habit.value', ''),
      goal: _.get(category, 'goal', ''),
    });
  }

  handleAddition(e, { value }) {
    this.setState({
      options: [{ text: value, value }, ...this.state.options],
    });
  }

  render() {
    const { goal, newHabit, options } = this.state;
    const {
      category,
      cancel,
      save,
      hideDelete,
      onRemove,
      disabled,
      categoryErrorDetails,
    } = this.props;

    const habitValue = (options.find(({ value }) => value === newHabit) || {})
      .text;

    return (
      <div className="content editing">
        {/* <div className="title">Goal</div>
        <div className="description">
          <Form.Field error={_.get(categoryErrorDetails, "goal", false) ? true : false}>
            <TextArea
              id="goal"
              value={goal}
              onChange={this.handleGoalChange}
              rows={0}
            />
          </Form.Field>
    </div> */}
        <div>
          <div className="title">Plan</div>
          <div>2x / week</div>
        </div>
        <div className="title">Behaviors</div>
        <div className="description">
          <Dropdown
            onChange={this.handleHabitChange}
            options={options}
            allowAdditions
            value={newHabit}
            fluid
            search
            selection
            onAddItem={this.handleAddition}
            selectOnBlur={false}
            error={!!_.get(categoryErrorDetails, 'habit', false)}
          />
        </div>
        <div className="buttons">
          <div className="handle-changes">
            <Button className="btn third" disabled={disabled} onClick={cancel}>
              {' '}
              Cancel{' '}
            </Button>
            <Button
              className="btn third"
              disabled={disabled}
              onClick={() => save(habitValue, goal)}
            >
              {' '}
              Accept{' '}
            </Button>
          </div>
          <div className="delete">
            {!hideDelete && (
              <Button
                className="btn third"
                disabled={disabled}
                onClick={() => onRemove(true)}
              >
                {' '}
                Deactivate Plan{' '}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default EditingCategory;
