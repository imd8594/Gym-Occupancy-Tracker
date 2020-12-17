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
} = process.env;

// calculate minutes in ms for use with setInteral()
const MINUTES = (minutes) => 1000 * 60 * minutes;

// initialize crunch gym
runCrunchGymInterval(MINUTES(POLL_FREQUENCY_MINUTES));

// initialize central rock gym
runCentralRockGymInterval(MINUTES(POLL_FREQUENCY_MINUTES));
