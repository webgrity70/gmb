import { makeFetchAction } from './utils';
import ProfileService from '../Services/ProfileService';

export const fetchOccupationOptions = makeFetchAction({
  actionGroup: 'PROFILE_FORMS',
  action: 'FETCH_OCCUPATION_OPTIONS',
  fetchData: ProfileService.getOccupationOptions,
});

export const fetchCurrentSchoolYearOptions = makeFetchAction({
  actionGroup: 'PROFILE_FORMS',
  action: 'FETCH_CURRENT_SCHOOL_YEAR_OPTIONS',
  fetchData: ProfileService.getCurrentSchoolYearOptions,
});

export const fetchEducationLevelOptions = makeFetchAction({
  actionGroup: 'PROFILE_FORMS',
  action: 'FETCH_EDUCATION_LEVEL_OPTIONS',
  fetchData: ProfileService.getEducationLevelOptions,
});

export const fetchNegativeBehaviourOptions = makeFetchAction({
  actionGroup: 'PROFILE_FORMS',
  action: 'FETCH_NEGATIVE_BEHAVIOUR_OPTIONS',
  fetchData: ProfileService.getNegativeBehaviourOptions,
});
