const express = require('express');
const cors = require('cors');
const config = require('./config.json');
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
app.get('/analytics/users', async (req, res) => {
  const { from = '7daysAgo', to = 'today' } = req.query;
  try {
    const metrics = await getUserMetrics(from, to);
    res.json(metrics);
  } catch (err) {
    console.error('User metrics error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user metrics' });
  }
});

// 🎯 New Users by Attribution
app.get('/analytics/new-users-attribution', async (req, res) => {
  const { from = '7daysAgo', to = 'today', dimension = 'firstUserDefaultChannelGroup' } = req.query;
  try {
    const data = await getNewUsersByAttribution(dimension, from, to);
    res.json({ from, to, dimension, data });
  } catch (err) {
    console.error('Attribution error:', err.message);
    res.status(500).json({ error: 'Failed to fetch attribution data' });
  }
});

// 🚦 Traffic Acquisition
app.get('/analytics/traffic', async (req, res) => {
  const { from = '7daysAgo', to = 'today', dimension, metric = 'sessions' } = req.query;

  if (!dimension) {
    return res.status(400).json({ error: 'Missing required "dimension" query param' });
  }

  try {
    const data = await getTrafficAcquisition(dimension, metric, from, to);
    res.json({ from, to, dimension, metric, data });
  } catch (err) {
    console.error('Traffic acquisition error:', err.message);
    res.status(500).json({ error: 'Failed to fetch traffic acquisition data' });
  }
});

// 🌍 Users by Country
app.get('/analytics/user-country', async (req, res) => {
  const { from = '2025-05-10', to = '2025-06-10', metric = 'activeUsers' } = req.query;
  try {
    const data = await getUsersByCountry(metric, from, to);
    res.json({ from, to, dimension: 'country', metric, data });
  } catch (err) {
    console.error('Country error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user breakdown by country' });
  }
});

// 📈 Active Users Trend
app.get('/analytics/active-users-trend', async (req, res) => {
  const { from = '2025-05-10', to = '2025-06-10' } = req.query;
  try {
    const data = await getActiveUsersTrend(from, to);
    res.json(data);
  } catch (err) {
    console.error('Active users trend error:', err.message);
    res.status(500).json({ error: 'Failed to fetch active users trend' });
  }
});



app.get('/analytics/event-count', async (req, res) => {
  const startDate = req.query.from || '2025-05-01';
  const endDate = req.query.to || '2025-06-17';
  const limit = req.query.limit || 10;

  try {
    const data = await getEventsByName(startDate, endDate, limit);
    res.json({ from: startDate, to: endDate, limit: parseInt(limit), data });
  } catch (err) {
    console.error('Event count error:', err.message);
    res.status(500).json({ error: 'Failed to fetch event counts', details: err.message });
  }
});

app.get('/analytics/key-events', async (req, res) => {
  const startDate = req.query.from || '2025-05-01';
  const endDate = req.query.to || '2025-06-17';
  const limit = req.query.limit || 10;

  try {
    const data = await getKeyEventsByName(startDate, endDate, limit);
    res.json({ from: startDate, to: endDate, limit: parseInt(limit), data });
  } catch (err) {
    console.error('Key events error:', err.message);
    res.status(500).json({ error: 'Failed to fetch key events', details: err.message });
  }
});

app.get('/analytics/metric-by-platform', async (req, res) => {
  const startDate = req.query.from || '7daysAgo';
  const endDate = req.query.to || 'today';
  const metric = req.query.metric || 'eventCount'; // 🟢 Pass: eventCount, keyEvents, totalRevenue

  try {
    const data = await getMetricByPlatform(startDate, endDate, metric);
    res.json({ from: startDate, to: endDate, metric, data });
  } catch (err) {
    console.error('Metric by platform error:', err.message);
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});



app.get('/analytics/users-by-os', async (req, res) => {
  const startDate = req.query.from || '2025-05-10';
  const endDate = req.query.to || '2025-06-10';
  const metric = req.query.metric || 'activeUsers'; // can be 'newUsers' or 'activeUsers'

  try {
    const data = await getUsersByOS(metric, startDate, endDate);
    res.json({ from: startDate, to: endDate, metric, data });
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch ${metric} by OS` });
  }
});

app.get('/analytics/users-by-platform-device', async (req, res) => {
  const startDate = req.query.from || '2025-05-10';
  const endDate = req.query.to || '2025-06-10';
  const metric = req.query.metric || 'activeUsers'; // allow 'newUsers' or 'activeUsers'

  try {
    const data = await getUsersByPlatformDeviceCategory(startDate, endDate, metric);
    res.json({ from: startDate, to: endDate, metric, data });
  } catch (err) {
    console.error('Error fetching users by platform/device:', err.message);
    res.status(500).json({ error: 'Failed to fetch users by platform and device category' });
  }
});





app.get('/analytics/views-events-trend', async (req, res) => {
  const from = req.query.from || '2025-05-10';
  const to = req.query.to || '2025-06-10';

  try {
    const result = await getViewsVsEventCountTrend(from, to);
    res.json(result); 
  } catch (err) {
    console.error('Views vs EventCount API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch views vs event count trend' });
  }
});

// 🟢 Server Running
app.listen(port, () => {
  console.log(`✅ Analytics API is running at http://localhost:${port}`);
});
