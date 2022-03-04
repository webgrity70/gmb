import React from 'react';
import _ from 'lodash';

import {
  SET_MODULES,
  NEXT_QUESTION,
  ADD_VALUE_TO_CURRENT_QUESTION,
  SET_LANGUAGES,
  SET_APPS,
  SET_HABITS,
  SHOW_REGISTER_FORM,
  SET_SOCIAL_IDS,
  REGISTER_COMPLETED,
  MOVE_TO_QUESTION,
  SET_BEHAVIOURS,
  ON_CUSTOM_APP_ADDED,
} from '../constants';

const DEAFULT_STATE = {
  showForm: true, // to show/hide register form
  modules: [],
  values: {},
  step: null,
  isLastQuestion: false,
  languages: [],
  apps: [],
  habits: [],
  behaviours: [],
  registered: false,
  moduleIndex: 0,
  questionIndex: 0,
};

export default (state = DEAFULT_STATE, action) => {
  const { payload } = action;

  switch (action.type) {
    case SET_MODULES:
      return {
        ...state,
        modules: action.payload,
      };

    case NEXT_QUESTION:
      return {
        ...state,
        moduleIndex: payload.moduleIndex,
        questionIndex: payload.questionIndex,
        isLastQuestion: payload.isLastQuestion,
      };

    case ADD_VALUE_TO_CURRENT_QUESTION:
      state.values[payload.questionIdentifier] = payload.value;
      return _.cloneDeep(state);

    case SET_LANGUAGES:
      return { ...state, languages: action.payload };

    case SET_APPS:
      return { ...state, apps: action.payload };

    case SET_HABITS:
      return { ...state, habits: action.payload };

    case SHOW_REGISTER_FORM:
      return { ...state, showForm: action.payload };

    case SET_SOCIAL_IDS:
      return {
        ...state,
        facebookId: payload.facebook,
        googleId: payload.google,
      };

    case REGISTER_COMPLETED:
      return { ...state, registered: true, showForm: true };

    case SET_BEHAVIOURS:
      return { ...state, behaviours: payload };

    case MOVE_TO_QUESTION:
      return {
        ...state,
        moduleIndex: payload.moduleIndex,
        questionIndex: payload.questionIndex,
        isLastQuestion: payload.isLastQuestion,
      };

    case ON_CUSTOM_APP_ADDED:
      state.apps.push({
        text: payload,
        key: payload,
        value: payload,
        content: () => (
          <div className="apps-container">
            <span>{payload}</span>
          </div>
        ),
      });
      return _.cloneDeep(state);

    default:
      return state;
  }
};
