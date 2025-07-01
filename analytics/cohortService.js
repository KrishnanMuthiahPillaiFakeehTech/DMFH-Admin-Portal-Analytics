const { analyticsDataClient, PROPERTY_ID } = require('./client');
const { startOfWeek, endOfWeek, addWeeks, format } = require('date-fns');

function formatWeekRange(start, end) {
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
}

async function getUserActivityByCohort(startDateStr, endDateStr) {
  const inputStartDate = new Date(startDateStr);
  const inputEndDate = new Date(endDateStr);

  // Firebase starts cohort from Sunday after selected date
  let cohortStart = startOfWeek(inputStartDate, { weekStartsOn: 0 });
  if (inputStartDate.getDay() !== 0) {
    cohortStart = addWeeks(cohortStart, 1);
  }

  const cohortEndLimit = endOfWeek(inputEndDate, { weekStartsOn: 0 });
  const cohorts = [];

  for (let i = 0; ; i++) {
    const cohortWeekStart = addWeeks(cohortStart, i);
    const cohortWeekEnd = endOfWeek(cohortWeekStart, { weekStartsOn: 0 });

    if (cohortWeekStart > cohortEndLimit) break;

    const label = formatWeekRange(cohortWeekStart, cohortWeekEnd);

    const [report] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      cohortSpec: {
        cohorts: [
          {
            name: `wk${i}`,
            dimension: 'firstTouchDate',
            dateRange: {
              startDate: format(cohortWeekStart, 'yyyy-MM-dd'),
              endDate: format(cohortWeekEnd, 'yyyy-MM-dd'),
            },
          },
        ],
        cohortsRange: {
          startOffset: 0,
          endOffset: 5,
          granularity: 'WEEKLY', // 👈 This must be exactly 'WEEK' or 'DAILY'
        },
      },
      dimensions: [
        { name: 'cohort' },
        { name: 'cohortNthWeek' }, // 👈 Required when granularity is 'WEEK'
      ],
      metrics: [{ name: 'cohortActiveUsers' }],
    });

    if (!report.rows || report.rows.length === 0) continue;

    const weekMap = {};
    for (const row of report.rows) {
      const week = parseInt(row.dimensionValues?.[1]?.value || '0', 10);
      const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
      weekMap[week] = users;
    }

    const week0Users = weekMap[0] || 0;
    if (week0Users === 0) continue;

    const weeks = [{ week: 0, users: week0Users, percentage: 100 }];
const now = new Date();
const maxWeek = Math.min(5, Math.floor((now - cohortWeekStart) / (7 * 24 * 60 * 60 * 1000)));

for (let w = 1; w <= maxWeek; w++) {
  if (weekMap[w]) {
    const percent = Math.round((weekMap[w] / week0Users) * 1000) / 10;
    weeks.push({ week: w, users: weekMap[w], percentage: percent });
  }
}
    // for (let w = 1; w <= 5; w++) {
    //   if (weekMap[w]) {
    //     const percent = Math.round((weekMap[w] / week0Users) * 1000) / 10;
    //     weeks.push({ week: w, users: weekMap[w], percentage: percent });
    //   }
    // }

    cohorts.push({ label, weeks });
  }

  return {
    from: format(cohortStart, 'yyyy-MM-dd'),
    to: format(cohortEndLimit, 'yyyy-MM-dd'),
    cohorts,
  };
}

module.exports = { getUserActivityByCohort };
