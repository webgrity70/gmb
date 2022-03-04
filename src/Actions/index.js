/* eslint-disable eqeqeq */
import _ from 'lodash';
import { REGISTER_FORM, SIGNUP_DATA, SIGNUP_ACTIVE } from '../constants';
import { setStep } from './actions_steps';
import { notificationMessage } from './actions_notification';
import OnboardingService from '../Services/OnboardingService';
import ProfileService from '../Services/ProfileService';

// TO BE MOVED TO actions_user.js //

function setFormAction(form_data) {
  return {
    type: REGISTER_FORM,
    payload: form_data,
  };
}
export function setSignupActive(state) {
  return {
    type: SIGNUP_ACTIVE,
    payload: state,
  };
}
export function SignupActive(state) {
  return (dispatch, getState) => {
    dispatch(setSignupActive(state));
  };
}

export function populateFormInfo() {
  return async (dispatch, getState) => {
    try {
      const modules = await OnboardingService.getModules();
      const habits = await OnboardingService.getHabits();
      const apps = await ProfileService.getApplicationsV2();
      const languages = await ProfileService.getLanguages();

      const appOptions = apps.map((item, index) => {
        const label = JSON.parse(JSON.stringify(item.name));
        delete item.name;
        item.text = label;
        item.value = label;
        return item;
      });

      for (let i = 0; i < modules.length; i++) {
        for (let j = 0; j < modules[i].questions.length; j++) {
          if (modules[i].questions[j].identifier === 'language') {
            modules[i].questions[j].options = languages.map((item) => {
              const label = JSON.parse(JSON.stringify(item.label));
              delete item.label;
              item.text = label;
              item.value = label;
              return item;
            });
          } else if (modules[i].questions[j].identifier === 'apps') {
            modules[i].questions[j].options = appOptions;
          } else if (modules[i].questions[j].identifier === 'habit') {
            modules[i].questions[j].options = habits;
          } else if (modules[i].questions[j].options.length) {
            modules[i].questions[j].options = modules[i].questions[
              j
            ].options.map((item, index) => {
              const label = JSON.parse(JSON.stringify(item.label));
              delete item.label;
              item.text = label;
              item.value = label;
              return item;
            });
          }
        }
      }

      const signupData = {};

      modules.map((item, index) =>
        modules[index].questions.map(
          (item2, index2) => (signupData[item2.identifier] = '')
        )
      );

      dispatch(setStep({ maxSteps_1: modules.length }));
      dispatch(setSignupDataAction(signupData));
      dispatch(setFormAction(modules));
    } catch (e) {
      notificationMessage(e.message, false);
    }
  };
}

export function setSignupDataAction(signupData) {
  return {
    type: SIGNUP_DATA,
    payload: signupData,
  };
}
export function populateSignupData(signupData) {
  return (dispatch) => {
    dispatch(setSignupDataAction(signupData));
  };
}

export function sendBillingData() {
  return async (dispatch, getState) => {
    const { signupData } = getState();
    let billing = {
      firstName: signupData.billing.first_name,
      lastName: signupData.billing.last_name,
      line1: signupData.billing.billing_addr1,
      city: signupData.billing.billing_city,
      state: signupData.billing.billing_state,
      zip: signupData.billing.billing_zip,
      country: signupData.billing.billing_country,
      email: signupData.billing.email,
    };
    billing = await OnboardingService.createSubscription(billing);
    if (billing.status === 'error') {
      notificationMessage(billing.message, false);
      return {};
    }

    signupData.billing = billing;
    dispatch(setSignupDataAction(signupData));
    return signupData.billing;
  };
}
export function createPortalSession(billing) {
  return OnboardingService.createPortalSession(billing);
}
export function getHostedSession(billing) {
  return OnboardingService.getHostedSession(billing);
}
export function sendUserSignup(history) {
  return async (dispatch, getState) => {
    const { signupData, registerForm } = getState();
    const sendData = JSON.parse(JSON.stringify(signupData));
    for (let i = 0; i < registerForm.length; i++) {
      for (let j = 0; j < registerForm[i].questions.length; j++) {
        const question = registerForm[i].questions[j];
        switch (question.type) {
          case 'multiple_selector':
            if (question.identifier === 'plan_days_of_week') {
              delete sendData[question.identifier];
            }
            break;
          case 'group_schools':
            sendData[question.identifier] = sendData[question.identifier]
              ? sendData[question.identifier].map((item) => item.place_id)
              : [];
            break;
          case 'groups_organizations':
            sendData[question.identifier] = sendData[question.identifier]
              ? sendData[question.identifier].map((item) => item.place_id)
              : [];
            break;
          case 'group_gyms':
            sendData[question.identifier] = sendData[question.identifier]
              ? sendData[question.identifier].map((item) => item.place_id)
              : [];
            break;
          case 'habit':
            sendData[question.identifier].goal = sendData.goal || '';
            sendData[question.identifier].name =
              sendData[question.identifier].label;
            break;
          case 'dropdown':
            sendData[question.identifier] = _.get(
              sendData,
              `${question.identifier}.value`,
              ''
            );
            break;
          case 'multiple_selector_with_other':
            sendData[question.identifier] = sendData[question.identifier]
              ? sendData[question.identifier].map((item) => item.value)
              : [];
            break;
          case 'billing':
            sendData.billing = {
              subscription_id: sendData.billing.subscriptionID || '',
              customer_id: sendData.billing.customerID || '',
            };
            break;
          case 'dropdown_with_currently_in':
            sendData[question.identifier] = sendData[question.identifier].value;
            break;
          case 'negative_behaviours':
            sendData[question.identifier] = [
              sendData[question.identifier].label,
            ];
            break;
          case 'input_text':
            if (sendData[question.identifier] === 'plan_session_duration') {
              sendData[question.identifier] = sendData[
                question.identifier
              ].replace('-', '');
            }

            break;
          default:
            break;
        }
      }
    }

    OnboardingService.userRegisterV2(sendData)
      .then((resp) => {
        if (resp.status === 'error') {
          Object.keys(resp.details).map((item) =>
            notificationMessage(`${item}: ${resp.details[item][0]}`, false)
          );

          const start = Object.keys(resp.details)[0];
          if (start === 'email' || start === 'password') {
            dispatch(setSignupActive(false));
            dispatch(setStep({ step_lvl_1: 0, step_lvl_2: 1 }));
            return;
          }
          for (let i = 0; i < registerForm.length; i++) {
            const questions = registerForm[i].questions;
            for (let j = 0; j < questions.length; j++) {
              if (questions[j].identifier == start) {
                dispatch(setSignupActive(false));
                dispatch(setStep({ step_lvl_1: i + 1, step_lvl_2: j }));
                return;
              }
            }
          }
        } else {
          dispatch(
            setStep({ step_lvl_1: registerForm.length + 1, step_lvl_2: 1 })
          );
          dispatch(setSignupActive(true));
        }
      })
      .catch((err) => {});
  };
}
// TO BE MOVED TO actions_user.js //
