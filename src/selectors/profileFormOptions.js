import { createSelector } from 'redux-starter-kit';
import sortBy from 'lodash/sortBy';

const getProfileFormOptions = (state) => state.profileForms.options;

/**
 * Occupations
 */

const getOccupationOptions = createSelector(
  [getProfileFormOptions],
  (allOptions) => allOptions.occupation || undefined
);

export const getOccupationOptionValues = createSelector(
  [getOccupationOptions],
  (options = []) => options.map((opt) => opt.value)
);

export const getOccupationOptionsSet = createSelector(
  [getOccupationOptionValues],
  (values = []) => new Set(values)
);

export const getAreOccupationOptionsLoaded = createSelector(
  [getOccupationOptions],
  (options) => !!options
);

/**
 * Current School Year
 */

const getCurrentSchoolYearOptions = createSelector(
  [getProfileFormOptions],
  (allOptions) => allOptions.currentSchoolYear || undefined
);

export const getCurrentSchoolYearOptionValues = createSelector(
  [getCurrentSchoolYearOptions],
  (options = []) => options.map((opt) => opt.value)
);

export const getAreCurrentSchoolYearOptionsLoaded = createSelector(
  [getCurrentSchoolYearOptions],
  (options) => !!options
);

/**
 * Education Level
 */

const getEducationLevelOptions = createSelector(
  [getProfileFormOptions],
  (allOptions) => allOptions.educationLevel || undefined
);

export const getEducationLevelOptionValues = createSelector(
  [getEducationLevelOptions],
  (options = []) => options.map((opt) => opt.value)
);

export const getAreEducationLevelOptionsLoaded = createSelector(
  [getEducationLevelOptions],
  (options) => !!options
);

/**
 * Negative behaviours
 */

export const getNegativeBehaviourOptions = createSelector(
  [getProfileFormOptions],
  (allOptions) => {
    if (!allOptions.negativeBehaviour) {
      return undefined;
    }
    return sortBy(allOptions.negativeBehaviour, (item) =>
      item.name === 'Lose Weight' ? 0 : 1
    );
  }
);

export const getAreNegativeBehaviourOptionsLoaded = createSelector(
  [getNegativeBehaviourOptions],
  (options) => !!options
);
