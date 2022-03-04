import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CategorySection from '../../Profile/CategorySection';
import {
  getIsSelf,
  getIsUserCategoriesLoaded,
  getIsUserProfileLoaded,
  getUserCategories,
  getUserProfileData,
  getMyProfileId,
} from '../../../selectors/profile';

import './CategoriesSection.scss';
import { fetchUserCategories as fetchUserCategoriesAction } from '../../../Actions/actions_profile';

class ProfileCategoriesSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingCategory: null,
      currentSentRequest: [],
    };
  }

  loadCategories = (category) => {
    const { profileId, fetchUserCategories } = this.props;
    fetchUserCategories(profileId);
    this.setState({
      editingCategory: category,
    });
  };

  toggleCurrent = (id) => {
    this.setState((prevState) => {
      if (prevState.currentSentRequest.includes(id)) {
        return {
          currentSentRequest: prevState.currentSentRequest.filter(
            (e) => e !== id
          ),
        };
      }
      return {
        currentSentRequest: [...prevState.currentSentRequest, id],
      };
    });
  };

  render() {
    const {
      categories,
      user,
      profile,
      isProfileLoaded,
      isCategoriesLoaded,
      isSelf,
      openChatWith,
      closeSidebarFunction,
      myCategories,
    } = this.props;
    const { editingCategory, currentSentRequest } = this.state;
    return (
      <div id="profile-categories-section">
        <div className="bg match-categories">
          <div className="padded-container">
            <div className="header-title">
              <h1>Goals &amp; Habits</h1>
            </div>
            {isProfileLoaded && isCategoriesLoaded && (
              <Grid columns={2} stackable>
                {categories.map((category, i) => (
                  <Grid.Column
                    key={`category-block-${_.get(category, 'id', i)}`}
                  >
                    <CategorySection
                      loggedUser={user}
                      user={profile}
                      category={category}
                      canEdit={isSelf}
                      openChatWith={openChatWith}
                      closeSidebarFunction={closeSidebarFunction}
                      loadCategories={this.loadCategories}
                      activeCategories={_.filter(
                        myCategories,
                        (currentCategory) => currentCategory.buddy
                      )}
                      editingCategory={editingCategory}
                      currentSentRequest={currentSentRequest}
                      onSentRequest={this.toggleCurrent}
                    />
                  </Grid.Column>
                ))}
              </Grid>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ProfileCategoriesSection.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  profile: PropTypes.shape({}).isRequired,
  isSelf: PropTypes.bool.isRequired,
  isProfileLoaded: PropTypes.bool.isRequired,
  isCategoriesLoaded: PropTypes.bool.isRequired,
  profileId: PropTypes.string.isRequired,
  user: PropTypes.shape({}).isRequired,
  closeSidebarFunction: PropTypes.func.isRequired,
  openChatWith: PropTypes.func.isRequired,
  fetchUserCategories: PropTypes.func.isRequired,
  myCategories: PropTypes.arrayOf(PropTypes.shape()),
};

const mapStateToProps = (state, props) => {
  const myId = getMyProfileId(state);
  return {
    categories: getUserCategories(state, props) || [],
    isSelf: getIsSelf(state, props),
    profile: getUserProfileData(state, props) || {},
    isProfileLoaded: getIsUserProfileLoaded(state, props),
    isCategoriesLoaded: getIsUserCategoriesLoaded(state, props) || false,
    myCategories: getUserCategories(state, { profileId: myId }) || [],
  };
};

const ConnectedProfileCategoriesSection = compose(
  connect(mapStateToProps, { fetchUserCategories: fetchUserCategoriesAction })
)(ProfileCategoriesSection);

ConnectedProfileCategoriesSection.propTypes = {
  profileId: PropTypes.string.isRequired,
  user: PropTypes.shape({}).isRequired,
  closeSidebarFunction: PropTypes.func.isRequired,
  openChatWith: PropTypes.func.isRequired,
};

export default ConnectedProfileCategoriesSection;
