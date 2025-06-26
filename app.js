const express = require('express');
const { getUserMetrics } = require('./analytics/userMetrics');
const { getNewUsersByAttribution } = require('./analytics/getNewUsersByAttribution');
const { getTrafficAcquisition } = require('./analytics/getTrafficAcquisition');
const { getUsersByCountry } = require('./analytics/getUsersByCountry');
const { getActiveUsersTrend } = require('./analytics/activeUsersTrend');
const { getUserActivityByCohort } = require('./analytics/getUserActivityByCohort');

const app = express();
const port = 3000;

app.get('/analytics/users', async (req, res) => {
  const startDate = req.query.from || '7daysAgo';
  const endDate = req.query.to || 'today';

  try {
    const metrics = await getUserMetrics(startDate, endDate);
    res.json(metrics);
  } catch (err) {
    console.error('User metrics error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user metrics' });
  }
});


app.get('/analytics/new-users-attribution', async (req, res) => {
  const startDate = req.query.from || '7daysAgo';
  const endDate = req.query.to || 'today';
  const dimension = req.query.dimension || 'firstUserDefaultChannelGroup'; // default fallback

  try {
    const data = await getNewUsersByAttribution(dimension, startDate, endDate);
    res.json({ from: startDate, to: endDate, dimension, data });
  } catch (err) {
    console.error('Error fetching attribution data:', err.message);
    res.status(500).json({ error: 'Failed to fetch attribution data' });
  }
});

app.get('/analytics/traffic', async (req, res) => {
  const startDate = req.query.from || '7daysAgo';
  const endDate = req.query.to || 'today';
  const dimension = req.query.dimension;
  const metric = req.query.metric || 'sessions';

  if (!dimension) {
    return res.status(400).json({ error: 'Missing required "dimension" query param' });
  }

  try {
    const data = await getTrafficAcquisition(dimension, metric, startDate, endDate);
    res.json({ from: startDate, to: endDate, dimension, metric, data });
  } catch (err) {
    console.error('Traffic acquisition error:', err.message);
    res.status(500).json({ error: 'Failed to fetch traffic acquisition data' });
  }
});


app.get('/analytics/user-country', async (req, res) => {
  const startDate = req.query.from || '2025-05-10';
  const endDate = req.query.to || '2025-06-10';
  const metric = req.query.metric || 'activeUsers'; // Note: use singular "metric"

  try {
    const data = await getUsersByCountry(metric, startDate, endDate);
    res.json({ from: startDate, to: endDate, dimension: 'country', metric, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user breakdown by country' });
  }
});




app.get('/analytics/active-users-trend', async (req, res) => {
  const startDate = req.query.from || '2025-05-10';
  const endDate = req.query.to || '2025-06-10';

  try {
    const data = await getActiveUsersTrend(startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('Active users trend error:', err.message);
    res.status(500).json({ error: 'Failed to fetch active users trend' });
  }
});



app.get('/analytics/user-cohorts', async (req, res) => {
  const startDate = req.query.from || '2025-05-10';
  const endDate = req.query.to || '2025-06-14';

  try {
    const data = await getUserActivityByCohort(startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error('Cohort report error:', err);
    res.status(500).json({ error: 'Failed to fetch cohort data' });
  }
});


app.listen(port, () => {
  console.log(`✅ Analytics API is running at http://localhost:${port}`);
});