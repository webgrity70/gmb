/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import NewPlanCard from '../../Elements/NewPlanCard';
// import useActionOnCondition from '../../../hooks/use-action-on-condition';
import { fetchGroupTemplates } from '../../../Actions/actions_groups';
import { getGroupTemplatesIds } from '../../../selectors/groups';
import useActionOnCondition from '../../../hooks/use-action-on-condition';
import { GroupTemplateCard } from '../../Plan/TemplateCard/TemplateCard';

import './PlanChallenges.scss';
import {
  getGroupTemplatesLoading,
  getGroupTemplatesLoaded,
} from '../../../selectors/requests';
import Loading from '../../Loading';

const bem = BEMHelper({ name: 'PlanChallenges', outputIsString: true });

const PlanChallenges = ({
  groupId,
  fetchTemplates,
  loadingTemplates,
  templatesLoaded,
  templates,
  isAdmin,
  isPrivate,
  hasPermission,
  onJoin,
}) => {
  const fetchTemplatesCb = React.useCallback(() => fetchTemplates(groupId), [
    fetchTemplates,
    groupId,
  ]);
  useActionOnCondition(fetchTemplatesCb, !templatesLoaded);

  if (loadingTemplates) {
    return <Loading />;
  }

  let noTemplatesElement = null;
  if (isAdmin && templates.length === 0) {
    noTemplatesElement = (
      <div className={bem('empty-admin')}>
        <h2>You haven’t created any group plans yet!</h2>
        <span className="mt-2">
          Your members can import the group's plans into their calendars.
        </span>
      </div>
    );
  } else if (isPrivate && !hasPermission) {
    noTemplatesElement = (
      <div className={bem('empty-admin')}>
        <h2>
          <span onClick={onJoin}>Join</span> to see plans!
        </h2>
      </div>
    );
  } else if (!isAdmin && hasPermission && templates.length === 0) {
    noTemplatesElement = (
      <div className={bem('empty-admin')}>
        <h2>No group plans yet!</h2>
        <span className="mt-2">Contact the group's admin to add plans.</span>
      </div>
    );
  } else if (!isAdmin && templates.length === 0) {
    noTemplatesElement = (
      <div className={bem('empty-admin')}>
        <h2>No group plans yet!</h2>
      </div>
    );
  }

  if (templatesLoaded) {
    return (
      <div className={bem()}>
        {noTemplatesElement}
        <div className="mt-4"></div>
        <Grid columns={3} padded stackable>
          {isAdmin && (
            <Grid.Column>
              <NewPlanCard groupId={groupId} />
            </Grid.Column>
          )}
          {templates.map((templateId) => (
            <Grid.Column key={templateId}>
              <GroupTemplateCard id={templateId} />
            </Grid.Column>
          ))}
        </Grid>
      </div>
    );
  }
  return null;
};

const mapStateToProps = (state) => ({
  templates: getGroupTemplatesIds(state),
  loadingTemplates: getGroupTemplatesLoading(state),
  templatesLoaded: getGroupTemplatesLoaded(state),
});

PlanChallenges.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.string),
  fetchTemplates: PropTypes.func,
  templatesLoaded: PropTypes.bool,
  groupId: PropTypes.number,
  loadingTemplates: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

export default connect(mapStateToProps, {
  fetchTemplates: fetchGroupTemplates,
})(PlanChallenges);
