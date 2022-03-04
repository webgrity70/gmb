import React, { Fragment, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'semantic-ui-react';
import { getCurrentChallengeMembers } from '../../../selectors/challenges';
import CopyToClipboard from '../../Elements/CopyToClipboard';
import { fetchMembers as fetchMembersAction } from '../../../Actions/actions_challenges';
import Table from '../MembersTable';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import './ChallengeMembers.scss';

export const bem = BEMHelper({
  name: 'ChallengeMembers',
  outputIsString: true,
});

const Members = ({ id, members, fetchMembers }) => {
  const fetchMembersCb = useCallback(() => fetchMembers(id), [
    fetchMembers,
    id,
  ]);
  useActionOnCondition(fetchMembersCb, members.length === 0);
  return (
    <div className={bem()}>
      <Fragment>
        <div>
          <h1 className={bem('title')}>Leaderboard</h1>
        </div>
        <div className="flex justify-end my-5">
          <CopyToClipboard
            toCopy={window.location.href}
            Success={
              <div className="table-invite-btn--active">
                <span>Copied link to clipboard</span>
                <span>Share with your friends.</span>
              </div>
            }
          >
            <Button className="table-invite-btn mt-4" color="orange">
              Invite Friend
            </Button>
          </CopyToClipboard>
        </div>
        <div className={bem('content')}>
          <Table members={members} id={id} />
        </div>
      </Fragment>
    </div>
  );
};

Members.propTypes = {
  id: PropTypes.number,
  fetchMembers: PropTypes.func,
  members: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state, { id }) => ({
  members: getCurrentChallengeMembers(state, { id }),
});

export default connect(mapStateToProps, { fetchMembers: fetchMembersAction })(
  Members
);
