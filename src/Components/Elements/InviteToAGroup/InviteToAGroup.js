/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useState,
  useEffect,
  useCallback,
  Fragment,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import { Dropdown, Input, Button, Icon } from 'semantic-ui-react';
import './InviteToAGroup.scss';
import {
  getHasReachedMyGroupsPaginationEnd,
  getMyVisibleGroups,
} from '../../../selectors/profile';
import { fetchMyGroups } from '../../../Actions/actions_profile';
import { getMyGroupsLoading } from '../../../selectors/requests';
import { inviteUserToGroup } from '../../../Actions/actions_groups';
import InviteToChallengeModal from '../InviteToChallengeModal/InviteToChallengeModal';

const bem = BEMHelper({ name: 'InviteToAGroup', outputIsString: true });

const InviteToAGroup = ({
  userId,
  groups,
  hasReachedEnd,
  loading,
  fetchGroups,
  inviteUser,
}) => {
  const [openSearch, toggleSearch] = useState(false);
  const [openChallengesModal, setOpenChallengesModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const filteredValues = useMemo(
    () => groups.filter((e) => new RegExp(searchValue, 'ig').test(e.name)),
    [groups, searchValue]
  );

  function loadMore() {
    fetchGroups({ usePagination: true, pageSize: 10 });
  }

  function onToggleSearch(e) {
    e.stopPropagation();
    if (openSearch) setSearchValue('');
    toggleSearch(!openSearch);
  }

  const onInvite = useCallback((groupId) => inviteUser({ groupId, userId }), [
    userId,
    inviteUser,
  ]);

  function Empty() {
    if (loading) {
      return 'Loading...';
    }
    if (groups.length) {
      return 'No groups found.';
    }
    return (
      <Fragment>
        You are not the admin/owner of any groups.{' '}
        <Link to="/new-group">Create one!</Link>
      </Fragment>
    );
  }

  useEffect(() => {
    fetchGroups({ usePagination: false, pageSize: 100 });
  }, []);
  return (
    <>
      <Dropdown
        icon={null}
        floating
        className={bem()}
        trigger={
          <Button color="orange" basic className={bem('trigger')}>
            Invite
            <Icon name="dropdown" className="pl-4" />
          </Button>
        }
      >
        <Dropdown.Menu className={bem('menu')}>
          {groups.length > 0 && (
            <Dropdown.Header>
              {!openSearch ? (
                <div className={bem('search-placeholder')}>
                  <span>Invite to join your Groups:</span>
                  <Icon name="search" onClick={onToggleSearch} />
                </div>
              ) : (
                <div className={bem('search')}>
                  <Input
                    value={searchValue}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search Group"
                    onChange={(e, { value }) => setSearchValue(value)}
                  />
                  <Icon name="times" onClick={onToggleSearch} />
                </div>
              )}
            </Dropdown.Header>
          )}
          {filteredValues.length > 0 ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={!hasReachedEnd && !loading}
              className={bem('list')}
              useWindow={false}
            >
              {filteredValues.map((group) => (
                <Dropdown.Item
                  className={bem('item')}
                  onClick={() => onInvite(group.id)}
                  key={group.id}
                >
                  <img src={group.icon} alt={group.name} />
                  <div>{group.name}</div>
                </Dropdown.Item>
              ))}
            </InfiniteScroll>
          ) : (
            <div className={bem('empty')}>
              <Empty />
            </div>
          )}
          <div
            className={bem('challenge')}
            onClick={() => setOpenChallengesModal(true)}
          >
            <span>Invite to join your challenges</span>
            <Icon name="chevron right" />
          </div>
        </Dropdown.Menu>
      </Dropdown>
      <InviteToChallengeModal
        userId={userId}
        open={openChallengesModal}
        onClose={() => setOpenChallengesModal(false)}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  groups: getMyVisibleGroups(state),
  loading: getMyGroupsLoading(state),
  hasReachedEnd: getHasReachedMyGroupsPaginationEnd(state),
});

InviteToAGroup.propTypes = {
  userId: PropTypes.number,
  fetchGroups: PropTypes.func,
  inviteUser: PropTypes.func,
  hasReachedEnd: PropTypes.bool,
  loading: PropTypes.bool,
  groups: PropTypes.arrayOf(PropTypes.shape()),
};

export default connect(mapStateToProps, {
  fetchGroups: fetchMyGroups,
  inviteUser: inviteUserToGroup,
})(InviteToAGroup);
