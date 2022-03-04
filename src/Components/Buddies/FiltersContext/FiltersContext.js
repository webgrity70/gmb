/* eslint-disable react/destructuring-assignment, no-restricted-syntax */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import BuddiesService from '../../../Services/BuddiesService';
import OnboardingService from '../../../Services/OnboardingService';
import { TrackEvent } from '../../../Services/TrackEvent';

const BUDDIES_FILTER_STATE = 'gmb-buddies-filter-state';
const ORDER = {
  asc: 'desc',
  desc: 'asc',
};

const defaultState = {
  isFiltering: false,
  recommendedBuddies: [],
  text: '',
  gender: 'Any',
  minAge: 16,
  maxAge: 122,
  occupation: 'Any',
  timezone: 'Any',
  healthFitnessCheckbox: true,
  learnCheckbox: true,
  workCheckbox: true,
  lifeCheckbox: true,
  healthFitnessOptions: [],
  errors: {},
  healthFitness: {
    value: 'Any',
    label: 'Any Habit',
  },
  learnOptions: [],
  learn: {
    value: 'Any',
    label: 'Any Habit',
  },
  workOptions: [],
  work: {
    value: 'Any',
    label: 'Any Habit',
  },
  lifeOptions: [],
  life: {
    value: 'Any',
    label: 'Any Habit',
  },
  joinedWithin: 'Any',
  hasMore: true,
  loading: false,
  orderBy: 'score',
  order: 'desc',
};

const FiltersContext = React.createContext({
  ...defaultState,
  handleChangeRadioGender: () => {},
  handleChangeRadioOccupation: () => {},
  handleChangeRadioTimezone: () => {},
  handleChangeRadioJoinedWithin: () => {},
  handleChangeRadioHealthFitnessCheckbox: () => {},
  handleChangeRadioLifeCheckbox: () => {},
  handleChangeRadioWorkCheckbox: () => {},
  handleChangeRadioLearnCheckbox: () => {},
  setHealthFitness: () => {},
  setLearn: () => {},
  setWork: () => {},
  setLife: () => {},
  filterRecommendations: () => {},
  onOrderChange: () => {},
  toggleFilter: () => {},
  handleChangeText: () => {},
  handleChangeAge: () => {},
});

export class Provider extends React.Component {
  state = defaultState;

  page = 0;

  constructor(props) {
    super(props);
    let state = {};

    try {
      const savedState = sessionStorage.getItem(BUDDIES_FILTER_STATE);
      state = savedState ? JSON.parse(savedState) : defaultState;
    } catch (e) {
      state = defaultState;
    }

    this.state = {
      ...state,
      hasMore: true,
      loading: false,
      recommendedBuddies: [],
    };

    this.onTextChange = debounce(() => {
      this.filterRecommendations(false);
    }, 500);
  }

  componentDidMount() {
    this.fetchHabits();
  }

  getContextValue() {
    const { state } = this;
    const filtersContext = {
      ...state,
      handleChangeRadioGender: this.handleChangeRadioGender,
      handleChangeRadioOccupation: this.handleChangeRadioOccupation,
      handleChangeRadioTimezone: this.handleChangeRadioTimezone,
      handleChangeRadioJoinedWithin: this.handleChangeRadioJoinedWithin,
      handleChangeRadioHealthFitnessCheckbox: this
        .handleChangeRadioHealthFitnessCheckbox,
      handleChangeRadioLifeCheckbox: this.handleChangeRadioLifeCheckbox,
      handleChangeRadioWorkCheckbox: this.handleChangeRadioWorkCheckbox,
      handleChangeRadioLearnCheckbox: this.handleChangeRadioLearnCheckbox,
      handleChangeAge: this.handleChangeAge,
      setHealthFitness: this.setHealthFitness,
      setLearn: this.setLearn,
      setWork: this.setWork,
      setLife: this.setLife,
      filterRecommendations: this.filterRecommendations,
      onOrderChange: this.onOrderChange,
      toggleFilter: this.toggleFilter,
      handleChangeText: this.handleChangeText,
    };
    if (this.filtersContext) {
      // only update this.filtersContext if something has changed
      for (const key of Object.keys(this.filtersContext)) {
        if (filtersContext[key] !== this.filtersContext[key]) {
          this.filtersContext = filtersContext;
          break;
        }
      }
    } else {
      // first time - nothing to compare
      this.filtersContext = filtersContext;
    }
    return this.filtersContext;
  }

  toggleFilter = () => {
    this.setState((state) => ({
      isFiltering: !state.isFiltering,
    }));
  };

  onOrderChange = (selectedOrder) => {
    let { order } = this.state;
    if (this.state.orderBy === selectedOrder) {
      order = ORDER[order];
    }
    this.setState(
      { order, orderBy: selectedOrder },
      this.filterRecommendations
    );
  };

  handleChangeText = (e) => {
    const text = e.target.value;
    this.setState({ text });
    this.onTextChange(text);
  };

  handleChangeAge = (key) => (e, { value }) => {
    const numValue = parseInt(value, 10);
    if (numValue >= 16 && numValue <= 122) {
      this.setState(
        (state) => ({
          [key]: numValue,
          errors: { ...state.errors, [key]: null },
        }),
        () => this.filterRecommendations()
      );
    } else {
      this.setState((state) => ({
        [key]: numValue,
        ...((numValue < 16 || numValue > 122) && {
          errors: {
            ...state.errors,
            [key]: key === 'minAge' ? 'Min age is 16' : 'Max age is 122',
          },
        }),
      }));
    }
  };

  handleChangeRadioGender = (e, { value }) => {
    this.setState({ gender: value }, () => this.filterRecommendations());
  };

  handleChangeRadioOccupation = (e, { value }) => {
    this.setState({ occupation: value }, () => this.filterRecommendations());
  };

  handleChangeRadioTimezone = (e, { value }) => {
    this.setState({ timezone: value }, () => this.filterRecommendations());
  };

  handleChangeRadioJoinedWithin = (e, { value }) => {
    this.setState({ joinedWithin: value }, () => this.filterRecommendations());
  };

  handleChangeRadioHealthFitnessCheckbox = () => {
    this.setState(
      (state) => ({ healthFitnessCheckbox: !state.healthFitnessCheckbox }),
      () => this.filterRecommendations()
    );
  };

  handleChangeRadioLifeCheckbox = () => {
    this.setState(
      (state) => ({ lifeCheckbox: !state.lifeCheckbox }),
      () => this.filterRecommendations()
    );
  };

  handleChangeRadioWorkCheckbox = () => {
    this.setState(
      (state) => ({ workCheckbox: !state.workCheckbox }),
      () => this.filterRecommendations()
    );
  };

  handleChangeRadioLearnCheckbox = () => {
    this.setState(
      (state) => ({ learnCheckbox: !state.learnCheckbox }),
      () => this.filterRecommendations()
    );
  };

  setHealthFitness = (healthFitness) => {
    this.setState({ healthFitness }, () => this.filterRecommendations());
  };

  setLearn = (learn) => {
    this.setState({ learn }, () => this.filterRecommendations());
  };

  setWork = (work) => {
    this.setState({ work }, () => this.filterRecommendations());
  };

  setLife = (life) => {
    this.setState({ life }, () => this.filterRecommendations());
  };

  filterRecommendations = async (isLoadingMore) => {
    if (this.loading) {
      return;
    }

    if (this.state.text) {
      TrackEvent('buddies-search-term');
    }

    if (isLoadingMore) {
      this.page = this.page + 1;
    } else {
      sessionStorage.setItem(BUDDIES_FILTER_STATE, JSON.stringify(this.state));
      this.page = 1;
    }
    this.setState({ loading: true });

    const { orderBy, order, text, minAge, maxAge } = this.state;

    const filters = { page: this.page, age_min: minAge, age_max: maxAge };

    let resultOrder = orderBy;

    if (order === 'desc') {
      resultOrder = `-${resultOrder}`;
    }

    if (this.state.gender !== 'Any') filters.gender = this.state.gender;
    if (this.state.occupation !== 'Any')
      filters.occupation = this.state.occupation;
    if (this.state.timezone !== 'Any') filters.timezone = this.state.timezone;
    const categories = [];
    const categoryHabits = {};
    if (this.state.healthFitnessCheckbox) {
      categories.push('Health & Fitness');
      if (this.state.healthFitness.value !== 'Any')
        categoryHabits['Health & Fitness'] = this.state.healthFitness.value;
    }
    if (this.state.learnCheckbox) {
      categories.push('Learn');
      if (this.state.learn.value !== 'Any')
        categoryHabits.Learn = this.state.learn.value;
    }
    if (this.state.lifeCheckbox) {
      categories.push('Life');
      if (this.state.life.value !== 'Any')
        categoryHabits.Life = this.state.life.value;
    }
    if (this.state.workCheckbox) {
      categories.push('Work');
      if (this.state.work.value !== 'Any')
        categoryHabits.Work = this.state.work.value;
    }
    if (categories.length > 0) {
      filters.categories = categories;
      filters.category_habits = categoryHabits;
    }
    if (this.state.joinedWithin !== 'Any')
      filters.joined_within = this.state.joinedWithin;

    try {
      const data = await BuddiesService.filterRecommendations(
        text,
        filters,
        resultOrder
      );
      this.setState((state) => ({
        recommendedBuddies:
          this.page > 1
            ? [...state.recommendedBuddies, ...data.results]
            : data.results,
        hasMore: !!data.next,
        loading: false,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  fetchHabits() {
    OnboardingService.getHabits()
      .then((dataset) => {
        // TODO: Change?
        for (const data of dataset) {
          const dropdownData = [
            {
              value: 'Any',
              label: 'Any Habit',
            },
            ...data.options.map(({ label }) => ({ label, value: label })),
          ];

          if (data.label === 'Health & Fitness') {
            this.setState({ healthFitnessOptions: dropdownData });
          } else if (data.label === 'Learn') {
            this.setState({ learnOptions: dropdownData });
          } else if (data.label === 'Work') {
            this.setState({ workOptions: dropdownData });
          } else if (data.label === 'Life') {
            this.setState({ lifeOptions: dropdownData });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { children } = this.props;
    return (
      <FiltersContext.Provider value={this.getContextValue()}>
        {children}
      </FiltersContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default FiltersContext;
