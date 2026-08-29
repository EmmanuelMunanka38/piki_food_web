import { api } from '../lib/api';

export const subscriptionsService = {
  async listPlans() {
    const res = await api.get('/subscriptions/plans');
    return res.data;
  },

  async getActive() {
    const res = await api.get('/subscriptions/my/active');
    return res.data;
  },

  async startTrial() {
    const res = await api.post('/subscriptions/start-trial');
    return res.data;
  },

  async subscribe(planId, phoneNumber) {
    const res = await api.post('/subscriptions/subscribe', { planId, phoneNumber });
    return res.data;
  },

  async upgrade(planId, phoneNumber) {
    const res = await api.post('/subscriptions/upgrade', { planId, phoneNumber });
    return res.data;
  },

  async checkLimit(feature) {
    const res = await api.get(`/subscriptions/check-limit/${feature}`);
    return res.data;
  },

  async cancel(subscriptionId) {
    const res = await api.post(`/subscriptions/cancel/${subscriptionId}`);
    return res.data;
  },
};
