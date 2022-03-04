/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Modal, Icon } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import InfiniteScroll from 'react-infinite-scroller';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import { CheckBox } from '../../ReduxForm';
import {
  getChallengesForInvites,
  getChallengesForInvitesPaginationNextUrl,
} from '../../../selectors/challenges';
import * as challengeActions from '../../../Actions/actions_challenges';
import { getChallengesForInvitesLoading } from '../../../selectors/requests';
import './InviteToChallengeModal.scss';
import { getUserInfo } from '../../../selectors/profile';

const bem = BEMHelper({ name: 'InviteToChallengeModal', outputIsString: true });

function InviteToChallengeModal({
  open,
  name,
  userId,
  onClose,
  hasMore,
  loading,
  challenges,
  inviteToChallenge,
  fetchChallengesForInvites,
}) {
  const [selected, setSelected] = useState([]);
  const baseModalProps = {
    open,
    onClose: () => onClose(),
    dimmer: 'inverted',
    className: bem(),
    closeOnDimmerClick: false,
    closeIcon: { name: 'close', color: 'grey' },
  };
  useActionOnCondition(fetchChallengesForInvites, open);
  if (!open) {
    return <Modal {...baseModalProps} />;
  }
  function loadMore() {
    fetchChallengesForInvites();
  }
  function onChangeCheckBox(id) {
    if (selected.includes(id)) setSelected(selected.filter((e) => e !== id));
    else setSelected([...selected, id]);
  }
  async function onSave() {
    const promises = selected.map((id) => inviteToChallenge(userId, id));
    try {
      onClose();
      await Promise.all(promises);
      toast.success('Invites sent');
    } catch (e) {
      toast.error(e.message || 'Something went wrong');
    }
  }
  return (
    <Modal {...baseModalProps}>
      <Modal.Content>
        <h5 className={bem('title')}>Invite to your Challenges</h5>
        <p className={bem('description')}>
          A notification email will be sent to {name} to join
        </p>
        <div className={bem('list')}>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore && !loading}
            useWindow={false}
          >
            {challenges.map((challenge) => (
              <div key={challenge.id} className="flex  mt-6">
                <CheckBox
                  name={challenge.name}
                  value={selected.includes(challenge.id)}
                  onChange={() => onChangeCheckBox(challenge.id)}
                />
                <div className="flex flex-col mt-1 ml-6">
                  <span className={bem('name')}>{challenge.name}</span>
                  <div className="flex mt-2">
                    {challenge.type === 'Flash' && (
                      <div className={bem('flash')}>
                        <Icon name="lightning" />
                        Flash challenge
                      </div>
                    )}
                    <span className={bem('date')}>
                      {moment(challenge.start).format('MMM DD')} -{' '}
                      {moment(challenge.finish).format('MMM DD, YYYY')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <a className="pointer" onClick={() => onClose()}>
          Cancel
        </a>
        <a className="pointer" onClick={() => onSave()}>
          Send Invites
        </a>
      </Modal.Actions>
    </Modal>
  );
}

InviteToChallengeModal.propTypes = {
  open: PropTypes.bool,
  name: PropTypes.string,
  onClose: PropTypes.func,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  userId: PropTypes.number,
  inviteToChallenge: PropTypes.func,
  challenges: PropTypes.arrayOf(PropTypes.shape()),
  fetchChallengesForInvites: PropTypes.func,
};

const mapStateToProps = (state, { userId }) => {
  const userInfo = getUserInfo(state, { profileId: userId }) || {};
  return {
    name: userInfo ? userInfo.name : '',
    challenges: getChallengesForInvites(state),
    hasMore: !!getChallengesForInvitesPaginationNextUrl(state),
    loading: getChallengesForInvitesLoading(state),
  };
};

export default connect(mapStateToProps, {
  fetchChallengesForInvites: challengeActions.fetchChallengesForInvites,
  inviteToChallenge: challengeActions.inviteToChallenge,
})(InviteToChallengeModal);
