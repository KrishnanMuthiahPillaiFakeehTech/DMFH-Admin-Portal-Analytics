const { getUserMetrics } = require('./analytics/userMetrics');
const { getNewUsersByAttribution } = require('./analytics/getNewUsersByAttribution');
const { getTrafficAcquisition } = require('./analytics/getTrafficAcquisition');
const { getUsersByCountry } = require('./analytics/getUsersByCountry');
const { getActiveUsersTrend } = require('./analytics/activeUsersTrend');
const { getEventsByName } = require('./analytics/getEventsByName');
const { getKeyEventsByName } = require('./analytics/getKeyEventsByName');
const { getMetricByPlatform } = require('./analytics/getMetricByPlatform');
const { getUsersByOS } = require('./analytics/getUsersByOS');
const { getUsersByPlatformDeviceCategory } = require('./analytics/getUsersByPlatformDeviceCategory');
const { getViewsVsEventCountTrend } = require('./analytics/viewsVsEventCount');

const registerRoute = require('./middlewares/registerRoute');
const { ANALYTICS } = require('./constants/routeConstants');

function registerRoutes(app) {
  registerRoute(app, 'get', ANALYTICS.USERS.PATH, { name: ANALYTICS.USERS.NAME }, async (req, res) => {
    const { from = '7daysAgo', to = 'today' } = req.query;
    const data = await getUserMetrics(from, to);
    res.json(data);
  });

  registerRoute(app, 'get', ANALYTICS.NEW_USERS_ATTRIBUTION.PATH, { name: ANALYTICS.NEW_USERS_ATTRIBUTION.NAME }, async (req, res) => {
    const { from = '7daysAgo', to = 'today', dimension = 'firstUserDefaultChannelGroup' } = req.query;
    const data = await getNewUsersByAttribution(dimension, from, to);
    res.json({ from, to, dimension, data });
  });

  registerRoute(app, 'get', ANALYTICS.TRAFFIC.PATH, { name: ANALYTICS.TRAFFIC.NAME }, async (req, res) => {
    const { from = '7daysAgo', to = 'today', dimension, metric = 'sessions' } = req.query;
    if (!dimension) return res.status(400).json({ error: 'Missing required "dimension" query param' });

    const data = await getTrafficAcquisition(dimension, metric, from, to);
    res.json({ from, to, dimension, metric, data });
  });

  registerRoute(app, 'get', ANALYTICS.USER_COUNTRY.PATH, { name: ANALYTICS.USER_COUNTRY.NAME }, async (req, res) => {
    const { from = '2025-05-10', to = '2025-06-10', metric = 'activeUsers' } = req.query;
    const data = await getUsersByCountry(metric, from, to);
    res.json({ from, to, dimension: 'country', metric, data });
  });

  registerRoute(app, 'get', ANALYTICS.ACTIVE_USERS_TREND.PATH, { name: ANALYTICS.ACTIVE_USERS_TREND.NAME }, async (req, res) => {
    const { from = '2025-05-10', to = '2025-06-10' } = req.query;
    const data = await getActiveUsersTrend(from, to);
    res.json(data);
  });

  registerRoute(app, 'get', ANALYTICS.EVENT_COUNT.PATH, { name: ANALYTICS.EVENT_COUNT.NAME }, async (req, res) => {
    const from = req.query.from || '2025-05-01';
    const to = req.query.to || '2025-06-17';
    const limit = parseInt(req.query.limit || 10);
    const data = await getEventsByName(from, to, limit);
    res.json({ from, to, limit, data });
  });

  registerRoute(app, 'get', ANALYTICS.KEY_EVENTS.PATH, { name: ANALYTICS.KEY_EVENTS.NAME }, async (req, res) => {
    const from = req.query.from || '2025-05-01';
    const to = req.query.to || '2025-06-17';
    const limit = parseInt(req.query.limit || 10);
    const data = await getKeyEventsByName(from, to, limit);
    res.json({ from, to, limit, data });
  });

  registerRoute(app, 'get', ANALYTICS.METRIC_BY_PLATFORM.PATH, { name: ANALYTICS.METRIC_BY_PLATFORM.NAME }, async (req, res) => {
    const from = req.query.from || '7daysAgo';
    const to = req.query.to || 'today';
    const metric = req.query.metric || 'eventCount';
    const data = await getMetricByPlatform(from, to, metric);
    res.json({ from, to, metric, data });
  });

  registerRoute(app, 'get', ANALYTICS.USERS_BY_OS.PATH, { name: ANALYTICS.USERS_BY_OS.NAME }, async (req, res) => {
    const from = req.query.from || '2025-05-10';
    const to = req.query.to || '2025-06-10';
    const metric = req.query.metric || 'activeUsers';
    const data = await getUsersByOS(metric, from, to);
    res.json({ from, to, metric, data });
  });

  registerRoute(app, 'get', ANALYTICS.USERS_BY_PLATFORM_DEVICE.PATH, { name: ANALYTICS.USERS_BY_PLATFORM_DEVICE.NAME }, async (req, res) => {
    const from = req.query.from || '2025-05-10';
    const to = req.query.to || '2025-06-10';
    const metric = req.query.metric || 'activeUsers';
    const data = await getUsersByPlatformDeviceCategory(from, to, metric);
    res.json({ from, to, metric, data });
  });

  registerRoute(app, 'get', ANALYTICS.VIEWS_EVENTS_TREND.PATH, { name: ANALYTICS.VIEWS_EVENTS_TREND.NAME }, async (req, res) => {
    const from = req.query.from || '2025-05-10';
    const to = req.query.to || '2025-06-10';
    const data = await getViewsVsEventCountTrend(from, to);
    res.json(data);
  });
}

module.exports = registerRoutes;
