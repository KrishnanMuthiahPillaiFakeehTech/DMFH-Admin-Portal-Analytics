function formatDate(yyyymmdd) {
  const year = yyyymmdd.substring(0, 4);
  const month = yyyymmdd.substring(4, 6);
  const day = yyyymmdd.substring(6, 8);
  return `${day}-${month}-${year}`;
}

function formatDuration(seconds) {
  const totalSeconds = parseFloat(seconds) || 0;

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(Math.round(totalSeconds % 60)).padStart(2, '0');

  return `${hours}:${minutes}:${secs}`;
}

module.exports = {
  formatDate,
  formatDuration,
};
