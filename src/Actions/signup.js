import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { toast } from 'react-toastify';
import OnboardingService from '../Services/OnboardingService';
import {
  ADD_VALUE_TO_CURRENT_QUESTION,
  NEXT_QUESTION,
  REGISTER_COMPLETED,
  REGISTER_ERROR,
  SET_APPS,
  SET_HABITS,
  SET_LANGUAGES,
  SET_MODULES,
  SET_SOCIAL_IDS,
  SHOW_REGISTER_FORM,
  MOVE_TO_QUESTION,
  REQUESTING_REGISTER,
  ON_CUSTOM_APP_ADDED,
} from '../constants';
import ProfileService from '../Services/ProfileService';
import LoginService from '../Services/LoginService';
import { trackSignup as gtmTrackSignup } from '../utils/gtm';

let savingInformation = false;

let ALL_HABITS = [];
const isNegativeBehaviourSelected = (values) =>
  values.build_habit === 'Reduce a Habit';

const QUESTION_VALIDATION = {
  current_school_year: (values) =>
    _.some(values.occupation, { value: 'Student' }),
  education_level: (values) => _.some(values.occupation, { value: 'Student' }),
  groups_school: (values) =>
    _.some(values.add_group_choices, { value: 'School' }),
  groups_gym: (values) => _.some(values.add_group_choices, { value: 'Gym' }),
  groups_organization: (values) =>
    _.some(values.add_group_choices, { value: 'Organization' }),
  timezone_range: (values) =>
    ['Virtual', 'Either'].includes(values.meeting_preference),
  distance: (values) =>
    ['In Person', 'Either'].includes(values.meeting_preference),
  negative_behaviours: isNegativeBehaviourSelected,
  negative_behaviours_confirmation: isNegativeBehaviourSelected,
  lose_weight: () => false,
};

const arrayCompleteValidation = (questionValue) =>
  questionValue && questionValue.length > 0;
const objectValueValidation = (questionValue) =>
  questionValue && questionValue.value;
const numberValidation = (questionValue) => _.isNumber(questionValue);

const valueToArray = (values) => _.map(values, (value) => value.value);

const FORMAT_QUESTION_BEFORE_SUBMITTING = {
  occupation: valueToArray,
  buddy_occupation: valueToArray,
  education_level: (education) => education.value,
  habit: (value, values) => ({
    name: value.habit,
    category: value.category,
    goal: values.goal,
    goal_importance: values.goal_importance || values.goal,
  }),
  negative_behaviours: (value, values) =>
    isNegativeBehaviourSelected(values) ? value : {},
  plan_number_of_times: (value) => parseInt(value.times, 10),
  location: (value) => _.get(value, 'placeId'),
};

const COMPLETE_VALIDATION = {
  default: (questionValue) => {
    if (typeof questionValue === 'string') {
      return questionValue && questionValue.trim();
    }
    return questionValue;
  },
  about: (value) => value && value.length >= 50,
  negative_behaviours: (value) => {
    if (
      value.specialBehaviours.LoseWeight &&
      !value.specialBehaviours.weightLoss
    )
      return false;
    return value;
  },
  location: FORMAT_QUESTION_BEFORE_SUBMITTING.location,
  age_range: arrayCompleteValidation,
  apps: arrayCompleteValidation,
  birth_date: (date) => moment(date).isBefore(moment().subtract(16, 'years')),
  billing: (value) =>
    value.billing_addr1 &&
    value.billing_city &&
    value.billing_country &&
    value.billing_state &&
    value.billing_zip &&
    value.email &&
    value.first_name &&
    value.last_name &&
    value.phone,
  buddy_occupation: arrayCompleteValidation,
  meeting_preference: arrayCompleteValidation,
  distance: numberValidation,
  education_level: objectValueValidation,
  groups_gym: arrayCompleteValidation,
  groups_organization: arrayCompleteValidation,
  groups_school: arrayCompleteValidation,
  habit: (questionValue) => questionValue && questionValue.category,
  i_consider_myself_more: numberValidation,
  i_feel_more_motivated_by: numberValidation,
  i_want_communication: numberValidation,
  i_want_my_plans_to_happen: numberValidation,
  im_confident_i_do_what_i_say: numberValidation,
  timezone_range: numberValidation,
  invite_emails: arrayCompleteValidation,
  language: arrayCompleteValidation,
  occupation: arrayCompleteValidation,
  plan_days: (questionValue, values) =>
    questionValue &&
    _.every(
      values.plan_days_of_week,
      (day) =>
        _.get(questionValue, `[${day}].time`, false) &&
        _.get(questionValue, `[${day}].place`, false)
    ),
  plan_days_of_week: arrayCompleteValidation,
  regarding_your_habit_would_you_consider_yourself: numberValidation,
  plan_number_of_times: (value) =>
    value &&
    parseInt(value.times, 10) >= 1 &&
    parseInt(value.times, 10) <= 7 &&
    value.duration &&
    value.option,
};

export const getInitialData = () => async (dispatch) => {
  try {
    const modules = await OnboardingService.getModules();

    _.forEach(modules, (module) => {
      _.forEach(module.questions, (question) => {
        if (
          [
            'distance',
            'timezone_range',
            'groups_school',
            'groups_gym',
            'groups_organization',
          ].includes(question.identifier)
        ) {
          question.optional = false;
        }

        if (
          ['billing', 'plan_number_of_times'].indexOf(question.identifier) !==
          -1
        ) {
          question.type = question.identifier;
        }
      });
    });

    dispatch({
      type: SET_MODULES,
      payload: modules,
    });

    const languages = await ProfileService.getLanguages();

    _.forEach(languages, (language) => {
      language.key = language.value;
      language.text = language.label;
      delete language.label;
    });

    dispatch({ type: SET_LANGUAGES, payload: languages });

    let apps = await ProfileService.getApplicationsV2();
    apps = _.map(apps, (app) => ({
      key: app.name,
      text: app.name,
      value: app.name,
      content: () => (
        <div className="apps-container">
          <img src={app.icon} alt={app.name} />
          <span>{app.name}</span>
        </div>
      ),
    }));
    dispatch({
      type: SET_APPS,
      payload: apps,
    });

    const habits = await OnboardingService.getHabits();

    ALL_HABITS = [...habits];

    dispatch({
      type: SET_HABITS,
      payload: habits,
    });

    const socialIds = await LoginService.getSocialIDs();

    dispatch({
      type: SET_SOCIAL_IDS,
      payload: socialIds,
    });
  } catch (e) {
    toast.error(e.message);
  }
};

const getIsLastQuestion = (modules, moduleIndex, questionIndex) =>
  modules.length === moduleIndex + 1 &&
  modules[moduleIndex].questions.length === questionIndex + 1;

const SubmitInformation = async (values, dispatch, modules) => {
  if (savingInformation) {
    return;
  }

  savingInformation = true;

  const data = {};
  _.forOwn(values, (value, key) => {
    if (FORMAT_QUESTION_BEFORE_SUBMITTING[key]) {
      value = FORMAT_QUESTION_BEFORE_SUBMITTING[key](value, values);
    }
    data[key] = value;
  });
  dispatch({
    type: REQUESTING_REGISTER,
  });

  let registration;
  try {
    registration = await OnboardingService.userRegisterV2(data);
    savingInformation = false;
    if (registration.status !== 'error') {
      gtmTrackSignup.accountCreated();
      localStorage.setItem('new-register', true);
      dispatch({
        type: REGISTER_COMPLETED,
      });
      return;
    }
  } catch (e) {
    dispatch({
      type: REGISTER_ERROR,
    });
    toast.error(e.message);
    return;
  }

  dispatch({
    type: REGISTER_ERROR,
  });

  const invalidIdentifiers = _.keys(registration.details);
  const questionNames = [];
  const invalidQuestions = [];

  _.forEach(modules, (module, moduleIndex) => {
    _.forEach(module.questions, (question, questionIndex) => {
      if (invalidIdentifiers.indexOf(question.identifier) !== -1) {
        invalidQuestions.push({
          ...question,
          index: questionIndex,
          moduleIndex,
        });
        questionNames.push(question.question);
      }
    });
  });

  if (invalidQuestions.length) {
    const question = invalidQuestions[0];
    const isLastQuestion = getIsLastQuestion(
      modules,
      question.moduleIndex,
      question.index
    );
    dispatch({
      type: MOVE_TO_QUESTION,
      payload: {
        moduleIndex: question.moduleIndex,
        questionIndex: question.index,
        isLastQuestion,
      },
    });
  }

  toast.error(`There are errors with: ${_.join(questionNames)}`, ', ');
};

const moveToNextQuestion = async (
  modules,
  moduleIndex,
  questionIndex,
  dispatch,
  isLastQuestion,
  values,
  movingFromUnavailableQuestion,
  moduleChanged = false
) => {
  let question = modules[moduleIndex].questions[questionIndex];
  if (!question.optional && !movingFromUnavailableQuestion) {
    const validationFunction =
      COMPLETE_VALIDATION[question.identifier] || COMPLETE_VALIDATION.default;
    if (!validationFunction(values[question.identifier], values)) {
      // if it isn't option and is not complete don't change question
      toast.error('Question is not valid.');
      return;
    }
  }

  questionIndex += 1;

  if (_.get(modules[moduleIndex], 'questions.length') <= questionIndex) {
    questionIndex = 0;
    moduleIndex += 1;
    moduleChanged = true;
  }

  isLastQuestion = getIsLastQuestion(modules, moduleIndex, questionIndex);

  question = modules[moduleIndex].questions[questionIndex];
  if (
    !!QUESTION_VALIDATION[question.identifier] &&
    !QUESTION_VALIDATION[question.identifier](values)
  ) {
    moveToNextQuestion(
      modules,
      moduleIndex,
      questionIndex,
      dispatch,
      isLastQuestion,
      values,
      true,
      moduleChanged
    );
  } else {
    if (moduleChanged) {
      gtmTrackSignup.viewQuestionnaireModule(modules[moduleIndex].name);
    }
    dispatch({
      type: NEXT_QUESTION,
      payload: {
        moduleIndex,
        questionIndex,
        isLastQuestion,
      },
    });
  }
};

export const nextQuestion = () => (dispatch, getState) => {
  const {
    modules,
    moduleIndex,
    questionIndex,
    isLastQuestion,
    values,
  } = getState().signup;

  if (isLastQuestion) {
    SubmitInformation(values, dispatch, modules);
    return;
  }

  moveToNextQuestion(
    modules,
    moduleIndex,
    questionIndex,
    dispatch,
    isLastQuestion,
    values
  );
};

const backToQuestion = (
  modules,
  moduleIndex,
  questionIndex,
  dispatch,
  values,
  moduleChanged = false
) => {
  if (moduleIndex === 0 && questionIndex === 0) {
    dispatch({ type: SHOW_REGISTER_FORM, payload: true });
    return;
  }

  questionIndex -= 1;

  if (questionIndex === -1) {
    moduleIndex -= 1;
    questionIndex = _.get(modules, `[${moduleIndex}].questions.length`, 0) - 1;
    moduleChanged = true;
  }

  const question = modules[moduleIndex].questions[questionIndex];

  if (
    !!QUESTION_VALIDATION[question.identifier] &&
    !QUESTION_VALIDATION[question.identifier](values)
  ) {
    backToQuestion(
      modules,
      moduleIndex,
      questionIndex,
      dispatch,
      values,
      moduleChanged
    );
  } else {
    if (moduleChanged) {
      gtmTrackSignup.viewQuestionnaireModule(modules[moduleIndex].name);
    }
    dispatch({
      type: NEXT_QUESTION,
      payload: { moduleIndex, questionIndex, isLastQuestion: false },
    });
  }
};

export const backQuestion = () => (dispatch, getState) => {
  const { modules, moduleIndex, questionIndex, values } = getState().signup;

  backToQuestion(modules, moduleIndex, questionIndex, dispatch, values);
};

export const addValueToCurrentQuestion = (value) => (dispatch, getState) => {
  const { moduleIndex, questionIndex, modules } = getState().signup;

  const currentQuestion = modules[moduleIndex].questions[questionIndex];

  dispatch({
    type: ADD_VALUE_TO_CURRENT_QUESTION,
    payload: {
      questionIdentifier: currentQuestion.identifier,
      value,
    },
  });
};

export const filterHabits = (search) => {
  let habits = _.map(ALL_HABITS, _.clone);
  if (search && search.trim()) {
    search = search.toLocaleLowerCase();
    habits = _.map(habits, (habit) => {
      habit.options = _.filter(
        habit.options,
        (option) => option.label.toLocaleLowerCase().indexOf(search) !== -1
      );
      return habit;
    });
  }

  return {
    type: SET_HABITS,
    payload: habits,
  };
};

// Form actions
export const handleChange = (value, input) => ({
  type: ADD_VALUE_TO_CURRENT_QUESTION,
  payload: {
    questionIdentifier: input,
    value,
  },
});

export const onSubmit = () => async (dispatch, getState) => {
  const {
    email,
    password,
    passwordconfirm,
    redirect_url,
    validating,
  } = getState().signup.values;

  if (validating) {
    return;
  }

  if (!email || !password || password !== passwordconfirm) {
    toast.error('Please verify your information');
    return;
  }

  dispatch({
    type: ADD_VALUE_TO_CURRENT_QUESTION,
    payload: {
      value: true,
      questionIdentifier: 'validating',
    },
  });

  try {
    const userExist = await OnboardingService.userExists(email);

    dispatch({
      type: ADD_VALUE_TO_CURRENT_QUESTION,
      payload: {
        value: false,
        questionIdentifier: 'validating',
      },
    });
    if (userExist.status !== 'error') {
      gtmTrackSignup.startQuestionnaire();
      dispatch({
        type: SHOW_REGISTER_FORM,
        payload: false,
      });
      return;
    }
    toast.error(userExist.message);
  } catch (e) {
    toast.error(e.message);
  }
};

export const onCustomAppAdded = (app) => ({
  type: ON_CUSTOM_APP_ADDED,
  payload: app,
});
