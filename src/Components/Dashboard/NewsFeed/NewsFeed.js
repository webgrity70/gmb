/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import {
  Icon,
  Button,
  TextArea,
  Select,
  FormField,
  Popup,
} from 'semantic-ui-react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import HtmlParse from '../HtmlText';
import { getUserCategories } from '../../../selectors/profile';
import { setStep } from '../../../Actions/actions_steps';
import {
  getFullNews,
  continueNewsFeed,
  setNewActivePage,
  setNewsFilter,
  setAltPage,
  setInput,
  sendNews,
} from '../../../Actions/actions_news_feed';
import Avatar from '../../Elements/Avatar';
import CategoryIcon from '../../Utils/CategoryIcon';
import DropdownFilter from '../DropdownFilter';
import Counter from '../Counter';
import UpcomingPlan from '../UpcomingPlan';

import './NewsFeed.scss';

const pageColors = ['#FAF5F3', '#F9FAF3', '#F4F3FA', '#F3F9FA'];

const DEFAULT_SCROLL_TIME_DELAY = 10000;

class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      filterChange: false,
      transitionClass: '',
      formQuoteLength: 0,
      formShoutOutLength: 0,
      mouseInNewsFeed: false,
      isFirstTime: true,
    };
    this.interval = null;
  }

  UNSAFE_componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isFirstTime } = this.state;
    if (this.interval && nextProps.news.altpage) {
      clearInterval(this.interval);
    } else if (nextProps.news.rotate && !this.interval) {
      this.startInterval();
    }

    if (nextProps.steps.step_lvl_1 !== this.props.steps.step_lvl_1) {
      this.setState({ transitionClass: 'd-prev' });
      setTimeout(() => {
        this.setState({ transitionClass: '' });
      }, 500);
    } else if (nextProps.steps.step_lvl_2 !== this.props.steps.step_lvl_2) {
      if (isFirstTime && nextProps.steps.step_lvl_2 === 0) {
        this.setState({
          transitionClass: 'd-prev',
          isFirstTime: false,
        });
        setTimeout(() => {
          this.setState({ transitionClass: '' });
        }, 500);
      } else if (
        this.props.steps.step_lvl_2 === 0 &&
        nextProps.steps.step_lvl_2 !== 1
      ) {
        this.setState({ transitionClass: 'd-next' });
        setTimeout(() => {
          this.setState({ transitionClass: '' });
        }, 500);
      } else if (
        nextProps.steps.step_lvl_2 === 0 &&
        this.props.steps.step_lvl_2 !== 1
      ) {
        this.setState({ transitionClass: 'd-prev' });
        setTimeout(() => {
          this.setState({ transitionClass: '' });
        }, 500);
      } else if (nextProps.steps.step_lvl_2 > this.props.steps.step_lvl_2) {
        this.setState({ transitionClass: 'd-prev' });
        setTimeout(() => {
          this.setState({ transitionClass: '' });
        }, 500);
      } else if (nextProps.steps.step_lvl_2 < this.props.steps.step_lvl_2) {
        this.setState({ transitionClass: 'd-next' });
        setTimeout(() => {
          this.setState({ transitionClass: '' });
        }, 500);
      }
    }
  }

  startInterval(force) {
    const { altpage, hasNews } = this.props.news;
    if (hasNews && !altpage) {
      if ((!this.interval && !this.state.mouseInNewsFeed) || force) {
        this.interval = setInterval(() => {
          this.switchPage();
        }, DEFAULT_SCROLL_TIME_DELAY);
      }
    }
  }

  componentDidMount() {
    if (!this.props.news.hasNews) {
      this.props.getFullNews();
    }
  }

  nextNews() {
    const { active } = this.props.news;

    const { step_lvl_2 } = this.props.steps;
    const next = step_lvl_2 + 1;
    const item = this.props.news.items[active];
    if (next < item.results.length) {
      this.props.setStep({ step_lvl_2: next });
    } else if (next == item.results.length && item.next) {
      this.props.continueNewsFeed(active, item.next, next);
    } else {
      this.props.setStep({ step_lvl_2: 0 });
    }
  }

  previousNews() {
    const { step_lvl_2 } = this.props.steps;
    const prev = step_lvl_2 - 1;
    if (prev >= 0) {
      this.props.setStep({ step_lvl_2: prev });
    } else {
      this.props.setStep({
        step_lvl_2:
          this.props.news.items[this.props.news.active].results.length - 1,
      });
    }
  }

  switchPage() {
    const { pages, filter } = this.props.news;
    if (filter.length < pages.length - 1) {
      const { step_lvl_1 } = this.props.steps;
      const next = step_lvl_1 + 1;

      if (next < pages.length) {
        this.props.setNewActivePage(pages[next], next);
      } else if (next == pages.length) {
        this.props.setNewActivePage(pages[0], 0);
      }
    }
  }

  switchPageClick(page) {
    const { altpage, hasNews, pages } = this.props.news;
    if (altpage) {
      this.props.setAltPage(false);
    }

    if (hasNews) {
      const index = pages.indexOf(page);
      this.props.setNewActivePage(page, index, true);
    }
  }

  parseNewLines(text) {
    return text.split('\n').map((item, key, self) => (
      <React.Fragment key={key}>
        {item}
        {self.length < key ? <br /> : ''}
      </React.Fragment>
    ));
  }

  handleChange(key, value) {
    const obj = { [key]: value };
    this.props.setInput(obj);
  }

  handleSubmit(key) {
    if (key == 'shout-outs') {
      const category = this.props.news.inputs.category;
      if (!category) {
        return toast.error('Category is Required');
      }

      const categoryPK = this.props.categories.find((e) => e.value === category)
        .key;

      this.handleChange('category', categoryPK);
    }
    this.props.sendNews(key);
  }

  handleClick = (e) => {
    if (this.filterNode && this.filterNode.contains(e.target)) {
      return;
    }
    this.setState({ showSettings: false });
  };

  renderNewsPage(item, page) {
    const { pageTitles } = this.props.news;
    const { step_lvl_1 } = this.props.steps;
    switch (page) {
      case 'hints':
        return (
          <div className="news-page centered_text">
            <div className="news-feed-header">{pageTitles[step_lvl_1]}</div>
            <div className="news-feed-item-header centered">
              <span>{item.title || ''}</span>
            </div>
            <div className="news-feed-item-paragraph  shout-out hint">
              {HtmlParse(item.text || '')}
            </div>
            <div className="news-feed-item-link">
              {item.linkTo ? (
                <a href={item.linkTo} target="blank">
                  Follow link {'>'}
                </a>
              ) : (
                ''
              )}
            </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="news-page announcements">
            <div className="news-feed-header">{pageTitles[step_lvl_1]}</div>
            <div className="news-feed-item-header">
              <span>{item.title || ''}</span>
            </div>
            <div className="news-feed-item-paragraph">
              {HtmlParse(item.text || '')}
            </div>
            <div className="news-feed-item-link">
              {' '}
              {item.linkTo ? (
                <a href={item.linkTo} target="blank">
                  Follow link {'>'}
                </a>
              ) : (
                ''
              )}
            </div>
          </div>
        );
      case 'quotes':
        if (this.props.news.altpage) {
          return (
            <div className="news-page">
              <TextArea
                placeholder="Type in the quote"
                className="textarea-small"
                onChange={(event) => {
                  if (event.target.value.length <= 160) {
                    this.setState({
                      formQuoteLength: event.target.value.length,
                    });
                    this.handleChange('quotes', event.target.value);
                  }
                }}
                value={
                  this.props.news.inputs.quotes
                    ? this.props.news.inputs.quotes
                    : ''
                }
              />
              <div className="quotes-by">
                <FormField>
                  <input
                    placeholder="Who is the author?"
                    onChange={(event) => {
                      if (event.target.value.length <= 160) {
                        this.handleChange('by', event.target.value);
                      }
                    }}
                    value={
                      this.props.news.inputs.by ? this.props.news.inputs.by : ''
                    }
                  />
                </FormField>
                <span className="counter">{`${this.state.formQuoteLength} / 160`}</span>
              </div>

              <div className="shout-out-buttons">
                <div />
                <div className="shout-out-buttons">
                  <Button
                    className="cancel-btn"
                    onClick={() => this.props.setAltPage(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="shout-btn"
                    onClick={() => this.props.sendNews('quotes')}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="news-page centered_text quotes announcements">
            <div className="news-feed-header">{pageTitles[step_lvl_1]}</div>
            {item.addedBy && (
              <Link to={`/profile/${item.addedBy.id}`}>
                <div className="news-feed-item-header news-feed-item-header-avatar v2 centered">
                  <div className="avatar">
                    <Avatar avatar={item.addedBy.avatar} />
                  </div>
                  <span>{item.addedBy.name || ''}</span>
                </div>
              </Link>
            )}
            <div className={cx({ 'mt-12': !item.addedBy })}>
              <div className="news-feed-item-paragraph shout-out">
                <p>"{item.text ? item.text : ''}"</p>
              </div>
              <div className="news-feed-item-quote">
                {' '}
                {item.by ? `- ${item.by}` : ''}{' '}
              </div>
            </div>
          </div>
        );

      case 'shout-outs':
        if (this.props.news.altpage) {
          return (
            <div className="news-page">
              <div className="text-area-container">
                <TextArea
                  className="textarea"
                  onChange={(event) => {
                    if (event.target.value.length <= 160) {
                      this.setState({
                        formShoutOutLength: event.target.value.length,
                      });
                      this.handleChange('shoutOut', event.target.value);
                    }
                  }}
                  value={
                    this.props.news.inputs.shoutOut
                      ? this.props.news.inputs.shoutOut
                      : ''
                  }
                />
                <span className="counter">{`${this.state.formShoutOutLength} / 160`}</span>
              </div>
              <div className="shout-out-buttons">
                <Select
                  options={this.props.categories}
                  placeholder="Select a category"
                  onChange={(e, { value }) => {
                    this.handleChange('category', value);
                  }}
                />

                <div className="shout-out-buttons">
                  <Button
                    className="cancel-btn"
                    onClick={() => this.props.setAltPage(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="shout-btn"
                    onClick={() => this.handleSubmit('shout-outs')}
                  >
                    Shout it!
                  </Button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="news-page centered_text announcements">
            <div className="news-feed-header">{pageTitles[step_lvl_1]}</div>
            {item.addedBy && (
              <Link to={`/profile/${item.addedBy.id}`}>
                <div className="news-feed-item-header-avatar shout-out">
                  <div
                    className={`news-feed-category-container ${item.category.slug}`}
                  >
                    {CategoryIcon.renderColorfulIcon(item.category.slug, true)}
                  </div>

                  <div className="avatar">
                    <Avatar avatar={item.addedBy.avatar} />
                  </div>
                  <span>{item.addedBy.name || ''}</span>
                </div>
              </Link>
            )}
            <div className={cx({ 'mt-12': !item.addedBy })}>
              <div className="news-feed-item-paragraph  shout-out ">
                <p>"{item.text ? item.text : ''}"</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <UpcomingPlan
            plan={this.props.plan}
            countdownRenderer={Counter}
            onUpdatePlan={this.props.onUpdatePlan}
          />
        );
    }
  }

  filterItems(item) {
    this.props.setNewsFilter(item);
    this.setState({ filterChange: !this.state.filterChange });
    if (this.props.news.filter.length > this.props.news.pages.length - 2) {
      this.props.setNewActivePage('upcoming', -1, true);
    }
  }

  render() {
    const { active, altpage } = this.props.news;
    const { step_lvl_1, step_lvl_2 } = this.props.steps;
    let item = {};
    if (this.props.news.hasNews) {
      if (this.props.news.items[active]) {
        if (this.props.news.items[active].results) {
          if (this.props.news.items[active].results[step_lvl_2]) {
            item = this.props.news.items[active].results[step_lvl_2];
          }
        }
      }
    }
    return (
      <div
        className="DashboardNewsFeed"
        onMouseEnter={() => {
          this.setState({
            mouseInNewsFeed: true,
          });
          clearInterval(this.interval);
        }}
        onMouseLeave={() => {
          this.setState({
            mouseInNewsFeed: false,
          });
          !altpage && this.startInterval(true);
        }}
      >
        <div
          className={`news-feed-container ${
            this.props.news.altpage ? 'd-inputs' : ''
          }`}
          style={{
            backgroundColor: this.props.news.altpage
              ? '#F2F2F2'
              : pageColors[step_lvl_1],
          }}
        >
          <div className="step-left" onClick={() => this.previousNews()}>
            <Icon
              name="angle left"
              className={
                !this.props.news.altpage &&
                _.get(this.props.news.items[active], 'results', []).length > 1
                  ? active != ''
                    ? 'd-block'
                    : 'd-none'
                  : 'd-none'
              }
            />
          </div>
          <div className="step-right" onClick={() => this.nextNews()}>
            <Icon
              name="big angle right"
              className={
                !this.props.news.altpage &&
                _.get(this.props.news.items[active], 'results', []).length > 1
                  ? active != ''
                    ? 'd-block'
                    : 'd-none'
                  : 'd-none'
              }
            />
          </div>

          <div
            className={`transition_page ${
              this.props.news.altpage ? 'd-active' : ''
            }`}
          >
            <div className={`transition_inner ${this.state.transitionClass}`}>
              {this.renderNewsPage(item, active)}
            </div>
          </div>
        </div>
        <div className="news-feed-footer">
          <div className="news-pages">
            <Popup
              trigger={
                <div
                  onClick={() => this.switchPageClick('announcements')}
                  className={`iconContainer ${
                    active == 'announcements' ? 'active' : ''
                  }`}
                >
                  <Icon
                    name="large newspaper"
                    disabled={this.props.news.filter.includes('announcements')}
                  />
                </div>
              }
              content="Announcements"
            />
            <Popup
              trigger={
                <div
                  onClick={() => this.switchPageClick('shout-outs')}
                  className={`iconContainer ${
                    active == 'shout-outs' ? 'active' : ''
                  }`}
                >
                  <Icon
                    name="bullhorn"
                    disabled={this.props.news.filter.includes('shout-outs')}
                  />
                </div>
              }
              content="Shout Outs"
            />
            <Popup
              trigger={
                <div
                  onClick={() => this.switchPageClick('quotes')}
                  className={`iconContainer ${
                    active == 'quotes' ? 'active' : ''
                  }`}
                >
                  <Icon
                    name="quote right"
                    disabled={this.props.news.filter.includes('quotes')}
                  />
                </div>
              }
              content="Quotes"
            />
            <Popup
              trigger={
                <div
                  onClick={() => this.switchPageClick('hints')}
                  className={`iconContainer ${
                    active == 'hints' ? 'active' : ''
                  }`}
                >
                  <Icon
                    name="info circle"
                    disabled={this.props.news.filter.includes('hints')}
                  />
                </div>
              }
              content="Hints"
            />
            <Popup
              trigger={
                <div
                  onClick={() => this.switchPageClick('upcoming')}
                  className={`iconContainer ${
                    active == 'upcoming' ? 'active' : ''
                  }`}
                >
                  <Icon name="large checked calendar" />
                </div>
              }
              content="Upcoming"
            />
          </div>
          <div className="news-settings-container">
            {active == 'shout-outs' && !altpage ? (
              <Button
                className="create-shout-outs"
                onClick={() => this.props.setAltPage(true)}
              >
                Shout something out
              </Button>
            ) : (
              ''
            )}
            {active == 'quotes' && !altpage ? (
              <Button
                className="create-shout-outs"
                onClick={() => this.props.setAltPage(true)}
              >
                Create your own
              </Button>
            ) : (
              ''
            )}
            <div
              className="iconContainer"
              ref={(filterNode) => (this.filterNode = filterNode)}
            >
              <Icon
                name="large cog"
                onClick={() =>
                  this.setState({ showSettings: !this.state.showSettings })
                }
              />
              <div
                className={`dropdown_container ${
                  this.state.showSettings ? 'd-block' : 'd-none'
                }`}
              >
                <div className="dropdown_header">
                  Filter the News Box content:
                </div>
                <div className="dropdown_items">
                  <DropdownFilter
                    filterItems={this.filterItems.bind(this)}
                    filter={this.props.news.filter}
                  />
                  {}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { user }) => {
  const { news, steps } = state;
  const categories = getUserCategories(state, { profileId: user.pk }) || [];
  const categoriesOptions = categories.map((item) => ({
    key: item.id,
    value: item.name,
    text: item.name,
  }));
  return {
    news,
    steps,
    categories: categoriesOptions,
  };
};

export default connect(mapStateToProps, {
  setStep,
  getFullNews,
  continueNewsFeed,
  setNewActivePage,
  setNewsFilter,
  setAltPage,
  setInput,
  sendNews,
})(NewsFeed);
