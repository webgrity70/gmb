import React, { Fragment, useState, useMemo } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import withSizes from 'react-sizes';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button, Sticky, Icon, Input } from 'semantic-ui-react';
import {
  getCurrentGroupMembers,
  getMembersPaginationSearch,
} from '../../../selectors/groups';
import Empty from '../EmptyMembers';
import CopyToClipboard from '../../Elements/CopyToClipboard';
import Table from '../MembersTable';
import PendingPrivateMembers from '../PendingPrivateMembers';
import MembersFilters from '../MembersFilters';
import { changeMembersSearch as changeMembersSearchAction } from '../../../Actions/actions_groups';
import './Members.scss';

export const bem = BEMHelper({ name: 'GroupMembers', outputIsString: true });

const Members = ({
  members,
  id,
  hasPermission,
  haveDescription,
  isMobile,
  isAdmin,
  isPrivate,
  search,
  changeMembersSearch,
}) => {
  const [val, setVal] = useState(search || '');
  const [isSticky, setSticky] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const searchDebounced = useMemo(() => debounce(changeMembersSearch, 700), [
    changeMembersSearch,
  ]);
  function onChangeValue({ target: { value } }) {
    setVal(value);
    searchDebounced(value);
  }
  const baseTableTitleClass = 'table-title';
  const tableTitleClass =
    members.length === 0
      ? `${baseTableTitleClass}--empty`
      : baseTableTitleClass;
  const showBigPadding = haveDescription && members.length === 0;
  const mainClasses = classNames('bg', 'wight', showBigPadding && 'pbc-32');
  function toggleFilters() {
    if (isSticky && openFilters) setSticky(false);
    setOpenFilters(!openFilters);
  }
  function toggleSticky() {
    setSticky(!isSticky);
  }
  return (
    <div className={mainClasses}>
      <div className="container">
        <Fragment>
          <div className={tableTitleClass}>
            <h1>Members</h1>
          </div>
          <div className={bem('content')}>
            {!isMobile && openFilters && (
              <Sticky onStick={toggleSticky} onUnstick={toggleSticky}>
                <MembersFilters />
              </Sticky>
            )}
            <div
              className={bem('search', {
                filtering: openFilters,
                sticky: isSticky,
              })}
            >
              <div className="padded-container">
                <div className="flex justify-end mb-5 flex flex-col mx-4 sm:flex-row md:mx-0">
                  {!isMobile && (
                    <Icon
                      name="sliders"
                      size="small"
                      onClick={toggleFilters}
                      className={bem('toggle', { active: openFilters })}
                    />
                  )}
                  <Input
                    icon="search"
                    value={val}
                    spellCheck="false"
                    autoCorrect="false"
                    autoComplete="false"
                    autoCapitalize="false"
                    className="flex-1 sm:mr-8"
                    onChange={onChangeValue}
                    placeholder="Search group members"
                  />
                  {(isAdmin || hasPermission) && (
                    <div className="mt-4 flex flex-col justify-center sm:flex-row sm:mt-0">
                      {isAdmin && isPrivate && (
                        <PendingPrivateMembers groupId={id} />
                      )}
                      {hasPermission && (
                        <CopyToClipboard
                          toCopy={window.location.href}
                          Success={
                            <div className="table-invite-btn--active">
                              <span>Copied link to clipboard</span>
                              <span>Share with your friends.</span>
                            </div>
                          }
                        >
                          <Button
                            className="table-invite-btn mt-4"
                            color="orange"
                          >
                            Invite Friend
                          </Button>
                        </CopyToClipboard>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="row__table padded-container">
                {members.length === 0 && <Empty id={id} />}
                <Table
                  members={members}
                  id={id}
                  isAdmin={isAdmin}
                  hasPermission={hasPermission}
                  isPrivate={isPrivate}
                />
              </div>
            </div>
            <div className="clearfix" />
          </div>
        </Fragment>
      </div>
    </div>
  );
};

Members.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object),
  hasPermission: PropTypes.bool,
  changeMembersSearch: PropTypes.func,
  id: PropTypes.number,
  search: PropTypes.string,
  haveDescription: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isPrivate: PropTypes.bool,
  isMobile: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  members: getCurrentGroupMembers(state),
  search: getMembersPaginationSearch(state),
});

const ConnectedMembers = connect(mapStateToProps, {
  changeMembersSearch: changeMembersSearchAction,
})(Members);

export default withSizes(({ width }) => ({
  isMobile: width < 768,
}))(ConnectedMembers);
