// adapted from https://github.com/simonlc/epoch-timeago/blob/master/src/index.js
// should a little tinier

const timeSegments = [
  3.154e10,
  2.628e9,
  6.048e8,
  8.64e7,
  3.6e6,
  60000,
  -Infinity,
];

const timeUnits = [
  "year",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "just now",
];

const makeTimeString = (unit: string, timeSegment: number, time: number) =>
  time >= 2 * timeSegment
    ? `${Math.floor(time / timeSegment)} ${unit} ago`
    : `1 ${unit} ago`;

export const timeAgo = (timestamp: number) => {
  const timeDifference = Date.now() - timestamp;
  const index = timeSegments.findIndex((time) => timeDifference >= time);
  const unit = timeUnits[index];
  return index >= 6
    ? unit
    : makeTimeString(unit, timeSegments[index], timeDifference);
};