const { analyticsDataClient, PROPERTY_ID } = require('./client');
const { startOfWeek, endOfWeek, addWeeks, format } = require('date-fns');

// Helper to label cohort ranges
function formatWeekRange(start, end) {
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
}

async function getUserActivityByCohort(startDateStr, endDateStr) {
  const startDate = startOfWeek(new Date(startDateStr), { weekStartsOn: 0 }); // Sunday
  const endDate = new Date(endDateStr);
  const cohorts = [];

  for (let i = 0; ; i++) {
    const cohortStart = addWeeks(startDate, i);
    const cohortEnd = endOfWeek(cohortStart, { weekStartsOn: 0 });

    if (cohortStart > endDate) break;

    const label = formatWeekRange(cohortStart, cohortEnd);

    // Step 1: Get Week 0 Users (first 7 days)
    const [week0Response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      cohortSpec: {
        cohorts: [{
          name: `wk${i}`,
          dimension: 'firstTouchDate',
          dateRange: {
            startDate: format(cohortStart, 'yyyy-MM-dd'),
            endDate: format(cohortEnd, 'yyyy-MM-dd')
          }
        }],
        cohortsRange: {
          startOffset: 0,
          endOffset: 6, // Days 0-6 = week 0
          granularity: 'DAILY'
        }
      },
      dimensions: [
        { name: 'cohort' },
        { name: 'cohortNthDay' }
      ],
      metrics: [{ name: 'cohortActiveUsers' }]
    });

    const week0Users = week0Response.rows?.reduce((sum, row) => {
      const day = parseInt(row.dimensionValues?.[1]?.value || '0', 10);
      const val = parseInt(row.metricValues?.[0]?.value || '0', 10);
      return day <= 6 ? sum + val : sum;
    }, 0);

    if (week0Users === 0) continue;

    const weeks = [{ week: 0, percentage: 100 }];

    // Step 2: Get activity for up to 6 weeks (42 days)
    const cohortSpec = {
      cohorts: [{
        name: `wk${i}`,
        dimension: 'firstTouchDate',
        dateRange: {
          startDate: format(cohortStart, 'yyyy-MM-dd'),
          endDate: format(cohortEnd, 'yyyy-MM-dd')
        }
      }],
      cohortsRange: {
        startOffset: 0,
        endOffset: 41, // days (6 weeks)
        granularity: 'DAILY'
      }
    };

    const [cohortResp] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      cohortSpec,
      dimensions: [
        { name: 'cohort' },
        { name: 'cohortNthDay' }
      ],
      metrics: [{ name: 'cohortActiveUsers' }]
    });

    // Step 3: Aggregate daily values into weekly buckets
    const weeklyData = {};

    cohortResp.rows?.forEach(row => {
      const dayOffset = parseInt(row.dimensionValues?.[1]?.value || '0', 10);
      const value = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const week = Math.floor(dayOffset / 7);
      if (week > 0) {
        weeklyData[week] = (weeklyData[week] || 0) + value;
      }
    });

    for (const [weekStr, val] of Object.entries(weeklyData)) {
      const week = parseInt(weekStr, 10);
      const percent = Math.round((val / week0Users) * 1000) / 10; // round to 1 decimal
      weeks.push({ week, percentage: percent });
    }

    cohorts.push({ label, weeks });
  }

  return {
    from: format(startDate, 'yyyy-MM-dd'),
    to: format(endDate, 'yyyy-MM-dd'),
    cohorts
  };
}

module.exports = { getUserActivityByCohort };
