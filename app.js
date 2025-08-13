const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const errorHandler = require('./analytics/errorHandler');
const asyncHandler = require('./utils/asyncHandler');


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


const app = express();
const port = 3000;

// ✅ Enable CORS
app.use(cors({
 origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


// 📊 User Metrics
app.get('/analytics/users', asyncHandler(async (req, res) => {
  const { from = '7daysAgo', to = 'today' } = req.query;
  const metrics = await getUserMetrics(from, to);
  res.json(metrics);
}));

// 🎯 New Users by Attribution
app.get('/analytics/new-users-attribution', asyncHandler(async (req, res) => {
  const { from = '7daysAgo', to = 'today', dimension = 'firstUserDefaultChannelGroup' } = req.query;
  const data = await getNewUsersByAttribution(dimension, from, to);
  res.json({ from, to, dimension, data });
}));

// 🚦 Traffic Acquisition
app.get('/analytics/traffic', asyncHandler(async (req, res) => {
  const { from = '7daysAgo', to = 'today', dimension, metric = 'sessions' } = req.query;

  if (!dimension) {
    res.status(400).json({ error: 'Missing required "dimension" query param' });
    return;
  }
  const data = await getTrafficAcquisition(dimension, metric, from, to);
  res.json({ from, to, dimension, metric, data });
}));

// 🌍 Users by Country
app.get('/analytics/user-country', asyncHandler(async (req, res) => {
  const { from = '2025-05-10', to = '2025-06-10', metric = 'activeUsers' } = req.query;

  const data = await getUsersByCountry(metric, from, to);
  res.json({ from, to, dimension: 'country', metric, data });
}));

// 📈 Active Users Trend
app.get('/analytics/active-users-trend', asyncHandler(async (req, res) => {
  const { from = '2025-05-10', to = '2025-06-10' } = req.query;

  const data = await getActiveUsersTrend(from, to);
  res.json(data);
}));


// 📊 Event Count
app.get('/analytics/event-count', asyncHandler(async (req, res) => {
  const startDate = req.query.from || '2025-05-01';
  const endDate = req.query.to || '2025-06-17';
  const limit = req.query.limit || 10;

  const data = await getEventsByName(startDate, endDate, limit);
  res.json({ from: startDate, to: endDate, limit: parseInt(limit), data });
}));

// 📊 Key Event Count
app.get('/analytics/key-events', asyncHandler(async (req, res) => {
  const startDate = req.query.from || '2025-05-01';
  const endDate = req.query.to || '2025-06-17';
  const limit = req.query.limit || 10;

  const data = await getKeyEventsByName(startDate, endDate, limit);
  res.json({ from: startDate, to: endDate, limit: parseInt(limit), data });
}));

// 📊 metric by platform
app.get('/analytics/metric-by-platform', asyncHandler(async (req, res) => {
  const startDate = req.query.from || '7daysAgo';
  const endDate = req.query.to || 'today';
  const metric = req.query.metric || 'eventCount';

  const data = await getMetricByPlatform(startDate, endDate, metric);
  res.json({ from: startDate, to: endDate, metric, data });
}));

// 📊 users by OS
app.get('/analytics/users-by-os', asyncHandler(async (req, res) => {
  const startDate = req.query.from || '2025-05-10';
  const endDate = req.query.to || '2025-06-10';
  const metric = req.query.metric || 'activeUsers'; // or 'newUsers'

  const data = await getUsersByOS(metric, startDate, endDate);
  res.json({ from: startDate, to: endDate, metric, data });
}));

// 📊 users platform device
app.get('/analytics/users-by-platform-device', asyncHandler(async (req, res) => {
  const startDate = req.query.from || '2025-05-10';
  const endDate = req.query.to || '2025-06-10';
  const metric = req.query.metric || 'activeUsers'; // or 'newUsers'

  const data = await getUsersByPlatformDeviceCategory(startDate, endDate, metric);
  res.json({ from: startDate, to: endDate, metric, data });
}));



app.get('/analytics/views-events-trend', asyncHandler(async (req, res) => {
  const from = req.query.from || '2025-05-10';
  const to = req.query.to || '2025-06-10';

  const result = await getViewsVsEventCountTrend(from, to);
  res.json(result);
}));

app.use((req, res) => {
  const route = `${req.method} ${req.originalUrl}`;

  res.status(404).json({
    error: 'API Not Found',
    route,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use(errorHandler);
// 🟢 Server Running
app.listen(port, () => {
  console.log(`✅ Analytics API is running at http://localhost:${port}`);
});
