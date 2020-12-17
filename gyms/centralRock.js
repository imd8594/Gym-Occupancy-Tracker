/**
 * Filename: centralRock.js
 * Date: 12/16/2020
 * Author: Ian Dansereau
 * 
 * Functions for central rock gym
 */

const jsdom = require("jsdom");
const { writeOccupancyValue, recreateBucket } = require('../db/influx');

// constants used from .env
const { CENTRAL_ROCK_LOCATION } = process.env;

const CENTRAL_ROCK_API = 'https://portal.rockgympro.com/portal/public/8739d0da7cbaf71e7b705269a129d177/occupancy';
const GYM_NAME = 'CentralRockGym';

/**
 * 
 * @param gymCode: Three letter identifier for Central Rock Gym location
 * @returns gym object
 *  {
 *   capacity: 104,
 *   count: 0,
 *   subLabel: 'Current climber count',
 *   lastUpdate: 'Last updated:&nbsp13 hours ago (9:43 PM)'
 *  }
 */
const getGymsData = async (gymCode) => {
  const vc = new jsdom.VirtualConsole();
  const { window } = await jsdom.JSDOM.fromURL(CENTRAL_ROCK_API, { virtualConsole: vc, runScripts: 'dangerously' });
  let { data } = window;

  data = JSON.parse(JSON.stringify(data));
  
  let gym;
  if (gymCode in data) {
    gym = data[gymCode];
  }

  if (gym !== undefined) {
    return gym;
  }

  console.log(`Gym not found for ${gymCode}. Defaulting to first gym..`);
  return data[0];
}

/**
 * 
 * @param gymCode: Three letter identifier for Central Rock Gym location
 * @returns count of current occupants
 */
const getCurrentOccupancy = async (gymCode) => {
  const { count } = await getGymsData(gymCode);
  return count;
}

/**
 * 
 * @param minutes: number of minutes to wait between run intervals 
 */
const runCentralRockGymInterval = async (minutes) => {
  const occupancy = await getCurrentOccupancy(CENTRAL_ROCK_LOCATION);
  await recreateBucket(GYM_NAME);
  writeOccupancyValue(GYM_NAME, CENTRAL_ROCK_LOCATION, occupancy);

  setInterval(async () => {
    const occupancy = await getCurrentOccupancy(CENTRAL_ROCK_LOCATION);
    writeOccupancyValue(GYM_NAME, CENTRAL_ROCK_LOCATION, occupancy);
  }, minutes);
}

module.exports = {
  runCentralRockGymInterval,
}
