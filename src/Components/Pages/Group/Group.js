import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import get from 'lodash/get';
import { fetchGroupAdmins as fetchGroupAdminsAction } from '../../../Actions/actions_groups';
import { getGroupAdmins } from '../../../selectors/groups';
import Group from '../../Group/Group';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import { withGroup } from '../../HoCs';
import { GROUP_STAFF } from '../../../constants';
import './Group.scss';

const REQUESTED = ['Queued', 'Requested'];

const GroupPage = ({ data, fetchGroupAdmins, admins, match, history }) => {
  if (isEmpty(data)) return null;

  const [currentPostId, setCurrentPostId] = useState(null);
  useEffect(() => {
    if (match.params.postid) {
      setCurrentPostId(match.params.postid);
    }
  }, [match.params]);

  const goToGroupPage = () => {
    history.push(`/groups/${data.id}`);
    setCurrentPostId(null);
  };

  const { privacy, userPermission, ...restData } = data;
  const isPrivate = privacy === 'Private';
  const hasPermission = userPermission && !REQUESTED.includes(userPermission);
  const pendingRequest = userPermission && REQUESTED.includes(userPermission);
  const isAdmin = userPermission && GROUP_STAFF.includes(userPermission);
  const fetchGroupAdminsCb = useCallback(() => fetchGroupAdmins(data.id), [
    fetchGroupAdmins,
    data.id,
  ]);
  useActionOnCondition(fetchGroupAdminsCb, !admins.length);
  return (
    <div className="group-profile">
      <Group
        {...restData}
        currentPostId={currentPostId}
        isPrivate={isPrivate}
        hasPermission={hasPermission}
        isAdmin={isAdmin}
        pendingRequest={pendingRequest}
        goToGroupPage={goToGroupPage}
      />
    </div>
  );
};

GroupPage.propTypes = {
  data: PropTypes.shape(),
  fetchGroupAdmins: PropTypes.func,
  admins: PropTypes.arrayOf(PropTypes.shape()),
};

const mapStateToProps = (state) => ({ admins: getGroupAdmins(state) });

export default compose(
  withRouter,
  withGroup({
    paramsSelector: (_, props) => {
      const idParam = get(props, 'match.params.id', null);
      const id = idParam ? parseInt(idParam, 10) : null;
      return id;
    },
  }),
  connect(mapStateToProps, {
    fetchGroupAdmins: fetchGroupAdminsAction,
  })
)(GroupPage);
