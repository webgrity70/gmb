import React, { useMemo } from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListModal from './ListModal';
import { getUserPsychologyData } from '../../../../selectors/profile';
import PsychologyList from './PsychologyList/PsychologyList';
import { withPsychology } from '../../../HoCs';
import { mergePsyco } from '../utils';
import './PsychologyModuleInfo.scss';

const baseClass = 'PsychologyModuleInfo';
const bem = BEMHelper({ name: baseClass, outputIsString: true });

const PsychologyModuleInfo = ({ allPsychology, psychology, maxSize }) => {
  const psycoList = useMemo(() => mergePsyco(allPsychology, psychology), [
    allPsychology,
    psychology,
  ]);
  const shortList = useMemo(() => psycoList.slice(0, maxSize), [
    psycoList,
    maxSize,
  ]);
  const remainingNumber = allPsychology.length - maxSize;
  return (
    <div>
      <PsychologyList items={shortList} />
      {remainingNumber > 0 && (
        <ListModal
          items={psycoList}
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

PsychologyModuleInfo.propTypes = {
  maxSize: PropTypes.number,
  allPsychology: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      identifier: PropTypes.string,
      minValue: PropTypes.string,
      maxValue: PropTypes.string,
    })
  ),
  psychology: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
      identifier: PropTypes.string,
      minValue: PropTypes.string,
      maxValue: PropTypes.string,
    })
  ),
};

PsychologyModuleInfo.defaultProps = {
  maxSize: 3,
};

const mapStateToProps = (state, props) => ({
  psychology: getUserPsychologyData(state, props),
});

const ConnectedPsychologyModuleInfo = connect(
  mapStateToProps,
  {}
)(PsychologyModuleInfo);

ConnectedPsychologyModuleInfo.propTypes = {
  profileId: PropTypes.string,
};

export default withPsychology({ skipLoading: true })(
  ConnectedPsychologyModuleInfo
);
