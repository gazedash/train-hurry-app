// @flow
export function createTimesFromArrival(time /*: number */) /*: number[] */ {
  const times = [60, 45, 30, 15];
  return times.filter(t => time >= t);
}
export function createFinalTimesFromArrival(ETA /*: Date */, now /*: Date */) {
  const diff = getDiff(ETA, now);
  let times = [...createTimesFromArrival(diff)];

  if (diff >= 0) {
    times.unshift(diff >= times[0] ? diff - times[0] : diff);
  }

  return times;
}
export const getSeconds = (date /*: Date */) => date.getTime() / 1000;
export const getDiff = (ETA /*: Date */, date /*: * */ = new Date()) => {
  const seconds = getSeconds(date);
  const ETAseconds = getSeconds(ETA);
  const diff = Math.round((ETAseconds - seconds) / 60);

  return diff;
};
export const minsToMs = (min /*: number */) => min * 60 * 1000;
