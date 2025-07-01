const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const { getUserMetrics } = require('./analytics/userMetrics');
const { getNewUsersByAttribution } = require('./analytics/getNewUsersByAttribution');
const { getTrafficAcquisition } = require('./analytics/getTrafficAcquisition');
const { getUsersByCountry } = require('./analytics/getUsersByCountry');
const { getActiveUsersTrend } = require('./analytics/activeUsersTrend');
const { getUserActivityByCohort } = require('./analytics/cohortService');
const { getViewsByScreen } = require('./analytics/getViewsByScreen');

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

// 🔁 Cohort Retention
app.get('/api/cohort-retention', async (req, res) => {
  const { from = '2025-05-10', to = '2025-06-10' } = req.query;
  try {
    const result = await getUserActivityByCohort(from, to);
    res.json(result);
  } catch (err) {
    console.error('Cohort retention error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// 📺 Views by Screen
app.get('/analytics/views-by-screen', async (req, res) => {
  const { from = '2025-06-01', to = '2025-06-17' } = req.query;
  try {
    const data = await getViewsByScreen(from, to);
    res.json({ from, to, data });
  } catch (err) {
    console.error('Views by screen error:', err.message);
    res.status(500).json({ error: 'Failed to fetch views by screen', details: err.message });
  }
});

// 🟢 Server Running
app.listen(port, () => {
  console.log(`✅ Analytics API is running at http://localhost:${port}`);
});
