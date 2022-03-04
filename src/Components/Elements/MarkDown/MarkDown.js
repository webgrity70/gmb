/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-target-blank */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import truncateHtml from 'truncate-html';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { getGroup } from '../../../selectors/groups';
import { getUserInfo } from '../../../selectors/profile';
import { getChallengeInviteData } from '../../../selectors/challenges';
import {
  getMultiGroupsLoaded,
  getMultiUsersLoaded,
  getMultiGroupsLoading,
  getMultiUsersLoading,
  getMultiChallengesLoading,
  getMultiChallengesLoaded,
} from '../../../selectors/requests';
import { fetchUserInformation as fetchUserInformationAction } from '../../../Actions/actions_profile';
import { fetchChallengeDetails as fetchChallengeDetailsAction } from '../../../Actions/actions_challenges';
import { fetchGroup as fetchGroupAction } from '../../../Actions/actions_groups';
import { handleBasicSource, profileRegex, PROFILE, GROUPS } from './utils';
import './MarkDown.scss';
import { isMedia } from '../MediaModal/utils';

const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);

function LinkRenderer({ href, children }) {
  return (
    <a href={href} target="_blank">
      {children}
    </a>
  );
}

LinkRenderer.propTypes = {
  href: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.any),
};

const MarkDown = ({
  source,
  truncate,
  basic,
  truncateLength,
  resources,
  fetchUser,
  fetchGroup,
  fetchChallengeDetails,
  setMediaModal,
}) => {
  useEffect(() => {
    resources
      .filter((e) => !e.data && !e.loaded && !e.loading)
      .forEach((e) => {
        if (e.type === PROFILE) fetchUser(e.id);
        else if (e.type === GROUPS) fetchGroup(e.id, false);
        else fetchChallengeDetails(e.id, false);
      });
  }, [resources]);
  if (basic) {
    const parsed = handleBasicSource(source, resources);
    return <div dangerouslySetInnerHTML={{ __html: parsed }} />;
  }
  let rendererComp = md.render(source);
  if (truncate) {
    rendererComp = truncateHtml(rendererComp, truncateLength);
  }

  rendererComp = rendererComp
    .replace('&lt;u&gt;', '<u>')
    .replace('&lt;/u&gt;', '</u>');

  if (setMediaModal) {
    const hyperlinks = rendererComp.match(/<a(.*?)<\/a>/g);

    if (hyperlinks) {
      hyperlinks.forEach((hyperlink) => {
        const content = hyperlink.substring(
          hyperlink.indexOf('>') + 1,
          hyperlink.lastIndexOf('</a>')
        );

        const patt = /href=["']([^"']*)["']/g;

        const hrefs = hyperlink.match(patt);
        if (hrefs && hrefs[0]) {
          const href = hrefs[0].replace('href="', '').slice(0, -1);
          if (href && content && isMedia(href)) {
            rendererComp = rendererComp.replace(
              hyperlink,
              `<span class="media-link" data-link=${href}>${content}</span>`
            );
          }
        }
      });
    }
  }

  const openMediaLink = (e) => {
    if (!setMediaModal) {
      return;
    }

    const el = e.target.closest('span');
    if (el) {
      e.stopPropagation();
      if (el.dataset.link) {
        setMediaModal(el.dataset.link);
      }
    }
  };

  return (
    <div
      onClick={openMediaLink}
      className="GMBMarkdown"
      dangerouslySetInnerHTML={{ __html: rendererComp }}
    />
  );
};

const mapStateToProps = (state, { source, basic }) => {
  if (!basic) return { resources: [] };
  const resources = source
    .split(' ')
    .filter((e) => !!e.match(profileRegex))
    .map((res) => {
      const paths = res.split('/');
      const id = parseInt(paths.pop(), 10);
      const type = paths.pop();
      const data = (() => {
        if (type === PROFILE) return getUserInfo(state, { profileId: id });
        if (type === GROUPS) return getGroup(state, { groupId: id });
        return getChallengeInviteData(state, {
          computedMatch: { params: { id } },
        });
      })();
      const loading = (() => {
        if (type === PROFILE) return getMultiUsersLoading(state, { id });
        if (type === GROUPS) return getMultiGroupsLoading(state, { id });
        return getMultiChallengesLoading(state, { id });
      })();
      const loaded = (() => {
        if (type === PROFILE) return getMultiUsersLoaded(state, { id });
        if (type === GROUPS) return getMultiGroupsLoaded(state, { id });
        return getMultiChallengesLoaded(state, { id });
      })();
      return {
        id,
        type,
        data,
        loaded,
        loading,
      };
    });
  return { resources };
};

const mapDispatchToProps = {
  fetchUser: fetchUserInformationAction,
  fetchGroup: fetchGroupAction,
  fetchChallengeDetails: fetchChallengeDetailsAction,
};

MarkDown.propTypes = {
  source: PropTypes.string,
  truncate: PropTypes.bool,
  basic: PropTypes.bool,
  resources: PropTypes.arrayOf(PropTypes.shape()),
  truncateLength: PropTypes.number,
  fetchUser: PropTypes.func,
  fetchChallengeDetails: PropTypes.func,
  fetchGroup: PropTypes.func,
};

MarkDown.defaultProps = {
  truncateLength: 15,
};

const ConnectedMarkDown = connect(
  mapStateToProps,
  mapDispatchToProps
)(MarkDown);

export default React.memo(ConnectedMarkDown);
