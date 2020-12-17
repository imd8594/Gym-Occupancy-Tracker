/**
 * Filename: crunch.js
 * Date: 12/16/2020
 * Author: Ian Dansereau
 * 
 * Functions for crunch gym
 */

const { $GET } = require('../utils/requests');
const { writeOccupancyValue, recreateBucket } = require('../db/influx');

// constants used from .env
const { CLUB_ZIP } = process.env;

const CRUNCH_API = 'https://www.crunch.com/crunch_core/clubs/';
const CLUB_API = (clubId) => `${CRUNCH_API}${clubId}`;
const GYM_NAME = 'CrunchGym';

/**
 * 
 * @param zip: zip code for crunch gym to track
 * @returns clubId and Name for gym in {zip} or defaults to ID 1 if none are found 
 */
const getClubInfoForZip = async (zip) => {
  const clubs = await $GET(CRUNCH_API) || [];
          
  const myClubs = clubs.reduce((acc, club) => {
    if (club.address.zip && club.address.zip === zip) {
      acc.push({ clubId: club.id, name: club.name });
    }
    return acc;
  }, []);

  // return first result if found
  if (myClubs.length) {
    return myClubs[0];
  }
  
  // otherwise return club with id 1
  console.log(`Club not found for ${zip}. Defaulting to ID: 1..`);
  return { id: 1, name: 'default' };
}

/**
 * 
 * @param clubId: identifier for Crunch Gym to pull data from
 * @returns current occupancy_status at Crunch Gym {clubId}
 */
const getCurrentCapacityStatus = async (clubId) => {
  const { occupancy_status } = await $GET(CLUB_API(clubId)) || '';
  return occupancy_status;
}

/**
 * 
 * @param clubId: identifier for Crunch Gym to pull data from
 * @returns current current_occupancy at Crunch Gym {clubId} 
 */
const getCurrentOccupancy = async (clubId) => {
  const { current_occupancy } = await $GET(CLUB_API(clubId)) || '';
  return current_occupancy;
}

/**
 * 
 * @param minutes: number of minutes to wait between run intervals 
 */
const runCrunchGymInterval = async (minutes) => {
  const {clubId, name} = await getClubInfoForZip(CLUB_ZIP);
  const occupancy = await getCurrentOccupancy(clubId);

  await recreateBucket('Gyms', GYM_NAME);
  writeOccupancyValue(GYM_NAME, name, occupancy);

  setInterval(async () => {
    const occupancy = await getCurrentOccupancy(clubId);
    writeOccupancyValue(GYM_NAME, name, occupancy);
  }, minutes);
}


module.exports = {
  runCrunchGymInterval,
}
