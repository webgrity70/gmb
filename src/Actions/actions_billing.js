import { makeFetchAction } from './utils';
import BillingService from '../Services/BillingService';

export const createHostedCheckout = makeFetchAction({
  actionGroup: 'BILING',
  action: 'CREATE_HOSTED_CHECKOUT',
  fetchData: BillingService.createHostedCheckout,
});

export const generatePortalSession = makeFetchAction({
  actionGroup: 'BILING',
  action: 'GENERAATE_PORTAL_SESSION',
  fetchData: BillingService.generatePortalSession,
});
