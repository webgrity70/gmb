import React from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItems from '../../../Elements/ListItems';
import ListModal from '../ListModal';
import { getUserGroupsData } from '../../../../selectors/profile';
import './GroupsModuleInfo.scss';

const baseClass = 'GroupsModuleInfo';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const GroupsModuleInfo = ({ groups, maxSize }) => {
  const shortList = groups.slice(0, maxSize);
  const remainingNumber = groups.length - maxSize;
  return (
    <div>
      <ListItems items={shortList} type="groups" />
      {remainingNumber > 0 && (
        <ListModal
          groups={groups}
          Trigger={
            <div className={bem('default-trigger')}>
              +{remainingNumber} see all
            </div>
          }
        />
      )}
    </div>
  );
};

GroupsModuleInfo.propTypes = {
  maxSize: PropTypes.number,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      type: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
};

GroupsModuleInfo.defaultProps = {
  maxSize: 8,
};

const mapStateToProps = (state, props) => ({
  groups: getUserGroupsData(state, props),
});

const ConnectedGroupsModuleInfo = connect(
  mapStateToProps,
  {}
)(GroupsModuleInfo);

ConnectedGroupsModuleInfo.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedGroupsModuleInfo;
