const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const key = require('../service-account.json');
const property_config = require('../property-id.json');

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: key,
});

const PROPERTY_ID = property_config.GA4_PROPERTY_ID;
module.exports = {
  analyticsDataClient,
  PROPERTY_ID,
};