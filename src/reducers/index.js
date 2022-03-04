import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';
import registerForm from './reducer_registerForm';
import signup from './signup';
import steps from './reducer_steps';
import news from './reducer_news';
import entities from './entities';
import session from './session';
import groupChat from './groupChat';
import challengesChat from './challengesChat';
import chat from './chat';
import group from './group';
import pagination from './pagination';
import profileForms from './profile-forms';
import profile from './profile';
import requests from './requests';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    entities,
    registerForm,
    signup,
    steps,
    chat,
    news,
    session,
    group,
    groupChat,
    challengesChat,
    pagination,
    profileForms,
    profile,
    requests,
    form: formReducer,
  });
