/**
 * Filename: influx.js
 * Date: 12/16/2020
 * Author: Ian Dansereau
 * 
 * InfluxDB configuration and functions for writing data
 */

const { InfluxDB, Point, HttpError } = require('@influxdata/influxdb-client');
const { OrgsAPI, BucketsAPI } = require('@influxdata/influxdb-client-apis')
const { getDayOfWeek } = require('../utils/dateUtils');

const {
  INFLUX_TOKEN,
  INFLUX_HOSTNAME,
  INFLUX_PORT,
  INFLUX_ORG_NAME,
} = process.env;

const client = new InfluxDB({url: `http://${INFLUX_HOSTNAME}:${INFLUX_PORT}`, token: INFLUX_TOKEN});

/**
 * @returns orgID
 * 
 * Function to check if org {INFLUX_ORG_NAME} already exists and recreate it if it does not
 */
const recreateOrg = async () => {
  const orgApi = new OrgsAPI(client);
  let orgId;

  try { 
    const { orgs } = await orgApi.getOrgs({ org: INFLUX_ORG_NAME });
    orgId = orgs[0].id;
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 404) {
      console.log(`Org ${INFLUX_ORG_NAME} did not exist. Recreating...`);
      // Org not found. Need to create it
      orgId = (await orgApi.postOrgs({ body: { org: INFLUX_ORG_NAME }})).id;
      console.log(`Created Org ${INFLUX_ORG_NAME}`);
    }
  }
  return orgId;
}

/**
 * 
 * @param bucketName: name of the bucket to create if it doesn't already exist
 * 
 * Function to check if bucket {bucketName} already exists and recreate it if it does not
 */
const recreateBucket = async (bucketName) => {
  const bucketsApi = new BucketsAPI(client);
  const orgId = await recreateOrg(INFLUX_ORG_NAME);

  try {
    await bucketsApi.getBuckets({ orgID: orgId, org: INFLUX_ORG_NAME, name: bucketName });
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 404) {
      console.log(`Bucket ${bucketName} did not exist. Recreating...`);
      // bucket not found. Need to create it
      await bucketsApi.postBuckets({ body: { orgID: orgId, name: bucketName }});
      console.log(`Created bucket ${bucketName} in Org ${INFLUX_ORG_NAME}`);
    }
  }
}

/**
 * 
 * @param {*} gymName 
 * @param {*} value 
 */
const writeOccupancyValue = (gymName, gymLocation, value) => {
  const writeApi = client.getWriteApi(INFLUX_ORG_NAME, gymName);
  const day = getDayOfWeek();

  writeApi.useDefaultTags({day: day})

  const point = new Point(gymLocation).intField('current_occupancy', value);
  writeApi.writePoint(point);
  writeApi
      .close()
      .then(() => {
          console.log(`Finished writing: ${day} @ ${new Date().toLocaleTimeString()}: Current Occupants: ${value}`);
      })
      .catch((err) => {
          console.error(err);
      })
}

module.exports = {
  recreateBucket,
  writeOccupancyValue,
}
