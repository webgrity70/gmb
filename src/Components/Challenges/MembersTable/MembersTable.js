import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import withSizes from 'react-sizes';
import { Button, Icon } from 'semantic-ui-react';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import InfiniteScroll from 'react-infinite-scroller';
import { getMembersPaginationNextUrl } from '../../../selectors/challenges';
import Loading from '../../Loading';
import { fetchMembers as fetchMembersAction } from '../../../Actions/actions_challenges';
import Table from '../../Elements/Table/Table';
import Avatar from '../../Elements/Avatar';
import first from '../../../Assets/images/badget-1.png';
import second from '../../../Assets/images/badget-2.png';
import thrid from '../../../Assets/images/badget-3.png';
import columns from './columns';
import { getChallengeMembersLoading } from '../../../selectors/requests';
import './Columns.scss';

const bem = BEMHelper({
  name: 'ChallengeMembersTableColumns',
  outputIsString: true,
});
const badgets = {
  1: first,
  2: second,
  3: thrid,
};

const MembersTable = ({
  id,
  members,
  fetchMembers,
  nextPage,
  loading,
  isMobile,
}) => {
  const isIOs =
    !!window.navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  function getMore() {
    fetchMembers(id);
  }
  function renderList() {
    if (isMobile) {
      return (
        <div>
          {members.map((member) => (
            <div className={bem('member')} key={`member-${member.id}`}>
              <div className="flex mb-4">
                <div className="mr-4 ml-1 my-auto">
                  {member.rank <= 3 && (
                    <img
                      src={badgets[member.rank]}
                      alt={`user-rank-${member.rank}`}
                      className={bem('badge')}
                    />
                  )}
                  {(!member.rank || member.rank > 3) && (
                    <div className={bem('rank')}>{member.rank || '-'}</div>
                  )}
                </div>
                <div className={bem('avatar')}>
                  <Avatar avatar={member.avatar} id={member.id} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className={bem('name')}>{member.name}</span>
                    <div className={bem('score')}>
                      <Icon name="hourglass half" />
                      {member.score || member.challengeScore}
                    </div>
                  </div>
                  <div className="flex">
                    <span className={bem('details')}>
                      {member.gender}
                      {member.gender && member.age && ','} {member.age}
                    </span>
                    <div className={bem('location')}>{member.location}</div>
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <span className={bem('label')}>Check In %:</span>
                <span className={cx(bem('value'), 'ml-3')}>
                  {member.checkInPercentage || '-'}
                </span>
              </div>
              <div className="mb-2">
                <span className={bem('label')}>Check In time:</span>
                <span className={cx(bem('value'), 'ml-3')}>
                  {member.checkInTime || '-'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className={bem('label')}>Note:</span>
                <span className={cx(bem('value'), 'ml-1')}>
                  {member.checkInNote || '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return <Table dataSource={members} columns={columns(bem)} />;
  }
  function renderNormal() {
    return (
      <Fragment>
        {renderList()}
        {nextPage && (
          <div className="flex justify-center mt-8 mb-8">
            <Button color="orange" onClick={getMore}>
              Load more
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
  if (isIOs) return renderNormal();
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={getMore}
      hasMore={!!nextPage && !loading}
      loader={<Loading />}
      threshold={400}
    >
      {renderList()}
    </InfiniteScroll>
  );
};

const mapStateToProps = (state) => ({
  nextPage: getMembersPaginationNextUrl(state),
  loading: getChallengeMembersLoading(state),
});

MembersTable.propTypes = {
  id: PropTypes.number,
  members: PropTypes.arrayOf(PropTypes.shape()),
  fetchMembers: PropTypes.func,
  isMobile: PropTypes.bool,
  loading: PropTypes.bool,
  nextPage: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
};
export default compose(
  connect(mapStateToProps, { fetchMembers: fetchMembersAction }),
  withSizes(({ width }) => ({
    isMobile: width < 768,
  }))
)(MembersTable);
