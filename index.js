/**
 * Filename: index.js
 * Date: 12/16/2020
 * Author: Ian Dansereau
 * 
 * Main entry point for application.
 * This application is designed to get the current occupancy of gyms and write them
 *      to a database to gather metrics on when it is safest to go during COVID
 */

const dotenv = require('dotenv').config();
const { runCrunchGymInterval, runCentralRockGymInterval } = require('./gyms');

const {
  POLL_FREQUENCY_MINUTES,
  CENTRAL_ROCK_LOCATIONS,
  CRUNCH_GYM_LOCATIONS,
} = process.env;

// calculate minutes in ms for use with setInteral()
const MINUTES = (minutes) => 1000 * 60 * minutes;

// initialize central rock gyms
if (CENTRAL_ROCK_LOCATIONS) {
  CENTRAL_ROCK_LOCATIONS.split(',').forEach((gymCode) => {
    runCentralRockGymInterval(gymCode, MINUTES(POLL_FREQUENCY_MINUTES));
  })
}

// initialize crunch gyms
if (CRUNCH_GYM_LOCATIONS) {
  CRUNCH_GYM_LOCATIONS.split(',').forEach((zipCode) => {
    runCrunchGymInterval(zipCode, MINUTES(POLL_FREQUENCY_MINUTES));
  })
}
