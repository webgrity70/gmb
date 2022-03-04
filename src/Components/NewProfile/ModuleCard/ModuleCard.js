import React from 'react';
import { Icon, Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import './ModuleCard.scss';

const bem = BEMHelper({ name: 'ProfileModuleCard', outputIsString: true });

function ModuleCard(props) {
  const { className, children, icon, name, footer, privacy } = props;
  return (
    <Card className={cx(bem(), className)}>
      <Card.Content>
        <div className="flex">
          <h3 className={bem('name')}>
            <Icon name={icon} />
            <span className="ml-2">{name}</span>
          </h3>
          {privacy ? <span className={bem('privacy')}>{privacy}</span> : null}
        </div>
      </Card.Content>
      <Card.Content>{children}</Card.Content>
      {footer && <Card.Content>{footer}</Card.Content>}
    </Card>
  );
}

ModuleCard.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  privacy: PropTypes.oneOf(['Public', 'Private']),
};

export default ModuleCard;
