import React from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItems from '../../../Elements/ListItems';
import AppsModal from '../ListModal';
import { getUserAppsData } from '../../../../selectors/profile';
import './AppsModuleInfo.scss';

const baseClass = 'AppsModuleInfo';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const AppsModuleInfo = ({ apps, maxSize }) => {
  const shortList = apps.slice(0, maxSize);
  const remainingNumber = apps.length - maxSize;
  return (
    <div>
      <ListItems items={shortList} borderOnImage={false} type="apps" />
      {remainingNumber > 0 && (
        <AppsModal
          apps={apps}
          borderOnImage={false}
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

AppsModuleInfo.propTypes = {
  maxSize: PropTypes.number,
  apps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      group: PropTypes.number,
      icon: PropTypes.string,
    })
  ),
};

AppsModuleInfo.defaultProps = {
  maxSize: 8,
};

const mapStateToProps = (state, props) => ({
  apps: getUserAppsData(state, props),
});

const ConnectedAppsModuleInfo = connect(mapStateToProps, {})(AppsModuleInfo);

ConnectedAppsModuleInfo.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedAppsModuleInfo;
