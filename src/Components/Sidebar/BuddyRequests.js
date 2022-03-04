import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import Loading from '../Loading';
import sidebar_service from '../../Services/SideBarService';

import BuddyRequest from './BuddyRequest';

class BuddyRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buddyRequests: [],
      nextUrl: null,
    };
    this.getBuddyRequests = this.getBuddyRequests.bind(this);
    this.loadMoreBuddyRequests = this.loadMoreBuddyRequests.bind(this);
  }

  componentDidMount() {
    this.setState({ loadingThreads: true });
    this.getBuddyRequests();
    this.updateInterval = setInterval(() => {
      if (this.props.new) {
        this.getBuddyRequests();
      }
    }, this.props.updateFrequency);
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval);
  }

  getBuddyRequests(updateUser = false) {
    const that = this;
    this.setState({ loadingThreads: true });
    if (this.props.new) {
      this.props.markBuddyRequestsSeen();
    }
    sidebar_service
      .getPendingBuddyRequests()
      .then((data) => {
        that.setState({
          buddyRequests: data.results,
          nextUrl: data.next,
          loadingThreads: false,
        });
      })
      .catch((data) => {
        that.setState({ loadingThreads: false });
        console.error(data);
      });
    if (updateUser) {
      this.props.updateUser(null, true);
    }
  }

  async loadMoreBuddyRequests() {
    if (!this.state.nextUrl || this.state.loadingThreads) {
      return;
    }
    this.setState({
      loadingThreads: true,
    });
    try {
      const res = await axios.get(this.state.nextUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      this.setState((state) => ({
        buddyRequests: [...state.buddyRequests, ...res.data.results],
        nextUrl: res.data.next,
        loadingThreads: false,
      }));
    } catch (e) {
      console.log(e);
      this.setState({
        loadingThreads: false,
      });
    }
  }

  render() {
    const { user } = this.props;
    return (
      <div className="buddy-requests-sidebar">
        <div className="sidebar-content">
          <div className="buddy-requests">
            {this.state.buddyRequests.length === 0 && (
              <p className="text-center">
                {this.state.loadingThreads
                  ? 'Loading...'
                  : 'There are no pending chat requests.'}
              </p>
            )}
            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMoreBuddyRequests}
              hasMore={!!this.state.nextUrl}
              loader={<Loading key={1} />}
              threshold={400}
              useWindow={false}
            >
              {this.state.buddyRequests.map((request, i) => (
                <BuddyRequest
                  user={user}
                  request={request}
                  key={i}
                  openChatWith={this.props.openChatWith}
                  getBuddyRequests={this.getBuddyRequests}
                />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    );
  }
}

export default BuddyRequests;
