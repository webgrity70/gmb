import React from 'react';
import _ from 'lodash';
import { Form, Button, Icon, Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';

class Referrals extends React.Component {
  state = {
    referral: '',
  };

  render() {
    let { value } = this.props;
    const { onChange } = this.props;
    const { referral } = this.state;

    const isEmailValid = (str) => {
      const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return pattern.test(str);
    };

    const onAddReferral = () => {
      if (!isEmailValid(referral)) {
        toast.error('Email is not valid');
        return;
      }
      value = value || [];
      value.push(referral);
      onChange(value);
      this.setState({ referral: '' });
    };

    const onRemoveReferral = (index) => {
      value.splice(index, 1);
      onChange(value);
    };

    const onKeyDown = (e) => {
      if (referral) {
        e.stopPropagation();
        if (e.keyCode === 13) {
          onAddReferral();
        }
      }
    };

    return (
      <div className="referral">
        <Form.Field>
          <Input
            type="email"
            onChange={(e, data) => this.setState({ referral: data.value })}
            value={referral}
            onKeyDown={onKeyDown}
          />
        </Form.Field>
        <Form.Field className="right_flex">
          <Button className="add_button" onClick={onAddReferral} animated>
            <Button.Content visible>Add</Button.Content>
            <Button.Content hidden>
              <Icon name="check" />
            </Button.Content>
          </Button>
        </Form.Field>
        <div className="selected">
          {value && (
            <Form.Field className="form_field_container_inner_title ">
              <span className="question_title">Selected:</span>
            </Form.Field>
          )}
          {_.map(value, (person, index) => (
            <div key={person} className="sub_item">
              {person}
              <Icon name="close" onClick={() => onRemoveReferral(index)} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Referrals;
