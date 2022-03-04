import React, { useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Table from '../../Elements/Table';
import columns from './columns';
import { getRegularChallenges } from '../../../selectors/challenges';
import RegularPreview from '../RegularPreview';
import { bem } from './utils';
import './ResultsList.scss';

const DIRECTIONS = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
};

function ResultsList({ challenges, myChallenges = false }) {
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  function onOpenModal(id) {
    setSelected(id);
    setOpenModal(true);
  }

  const [currentOrder, setCurrentOrder] = useState('regular');
  const [direction, setDirection] = useState(DIRECTIONS.ASCENDING);

  function onSortBy(param) {
    if (currentOrder === param && direction === DIRECTIONS.ASCENDING) {
      setDirection(DIRECTIONS.DESCENDING);
    } else {
      setCurrentOrder(param);
      setDirection(DIRECTIONS.ASCENDING);
    }
  }

  let sortFunction = () => {};

  if (currentOrder === 'regular') {
    if (direction === DIRECTIONS.ASCENDING) {
      sortFunction = (a, b) => {
        if (a.featured && !b.featured) {
          return -1;
        }

        if (!a.featured && b.featured) {
          return 1;
        }

        if (a.start < b.start) {
          return -1;
        }
        if (a.start > b.start) {
          return 1;
        }
        return 0;
      };
    } else {
      sortFunction = (a, b) => {
        if (a.featured && !b.featured) {
          return 1;
        }

        if (!a.featured && b.featured) {
          return -1;
        }
        if (a.start > b.start) {
          return -1;
        }
        if (a.start < b.start) {
          return 1;
        }
        return 0;
      };
    }
  } else if (currentOrder === 'creator') {
    if (direction === DIRECTIONS.ASCENDING) {
      sortFunction = (a, b) => {
        const aName = a.challengeManager ? a.challengeManager.name : '';
        const bName = b.challengeManager ? b.challengeManager.name : '';

        if (aName < bName) {
          return -1;
        }
        if (aName > bName) {
          return 1;
        }
        return 0;
      };
    } else {
      sortFunction = (a, b) => {
        const aName = a.challengeManager ? a.challengeManager.name : '';
        const bName = b.challengeManager ? b.challengeManager.name : '';

        if (aName > bName) {
          return -1;
        }
        if (aName < bName) {
          return 1;
        }
        return 0;
      };
    }
  } else {
    if (direction === DIRECTIONS.ASCENDING) {
      sortFunction = (a, b) => {
        if (a[currentOrder] < b[currentOrder]) {
          return -1;
        }
        if (a[currentOrder] > b[currentOrder]) {
          return 1;
        }
        return 0;
      };
    } else {
      sortFunction = (a, b) => {
        if (a[currentOrder] > b[currentOrder]) {
          return -1;
        }
        if (a[currentOrder] < b[currentOrder]) {
          return 1;
        }
        return 0;
      };
    }
  }

  const mapedChallenges = challenges
    .sort(sortFunction)
    .filter((c) => !myChallenges || c.joinedAt !== null)
    .map((e) => ({
      ...e,
      className: cx({ featured: e && e.featured }),
      creator: e.challengeManager ? e.challengeManager.name : '',
      creatorId: e.challengeManager ? e.challengeManager.id : '',
      showRow: myChallenges,
    }));

  return (
    <div className={cx(bem(), 'table-responsive')}>
      <Table
        dataSource={mapedChallenges}
        columns={columns({ onOpenModal })}
        onSortBy={onSortBy}
        currentOrder={currentOrder}
        direction={direction}
      />
      <RegularPreview
        id={selected}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}

ResultsList.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.shape()),
};

const mapStateToProps = (state) => ({
  challenges: getRegularChallenges(state),
});

export default connect(mapStateToProps)(ResultsList);
