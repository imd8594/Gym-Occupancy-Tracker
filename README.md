# Gym Occupancy Tracker
Keep track of how many people are at your gyms so you can plan the safest time to visit during the COVID-19 pandemic.

---
## Requirements

For development, you will need Node.js and Docker.

Node.js (https://nodejs.org/en/download/)

Docker (https://docs.docker.com/get-docker/)

## Install

    $ git clone https://github.com/imd8594/Gym-Occupancy-Tracker.git
    $ cd Gym-Occupancy-Tracker
    $ npm install

## Configure app

Open `/Gym-Occupancy-Tracker/.env-sample` then edit it with your settings. You will need:

- POLL_FREQUENCY_MINUTES=<your_value>
- INFLUX_TOKEN=<token_generated_in_InfluxDB>
- INFLUX_HOSTNAME=<hostname_or_localhost>
- INFLUX_PORT=8086
- INFLUX_ORG_NAME=<Org_name_inside_InfluxDB>
- CENTRAL_ROCK_LOCATIONS=<comma,separated,location,codes>
- CRUNCH_GYM_LOCATIONS=<comma,separated,zipcodes>

Lastly, rename `.env-sample` to `.env` and save.

## Running the project locally

Running the application via docker-compose will create a Node.js container on port 8080 and a InfluxDB container on port 8086.

    $ docker-compose up --build -d
    
## Running the project for production

This configuration assumes you have created a Microsoft Azure subscription and you have created a Storage Account.
You can find helpful instructions for pushing containers to Azure here: (https://docs.microsoft.com/en-us/azure/container-instances/tutorial-docker-compose)

Modify `.env` to include the additional items: 

- AZURE_SHARE_NAME=<azure_file_share_name>
- AZURE_STORAGE_NAME=<azure_storage_account_name>
- AZURE_IMAGE_NAME=<your_acr_name.azurecr.io/your_image_name>
- AZURE_DOMAIN_NAME=<application_domain_name>

Build the project locally

    $ docker-compose up --build -d
  
Take it down and push image up to ACI:

    $ docker-compose down
    $ docker-compose push

Switch to your ACI context:

    $ docker context use <your_aci_context>

Launch the project:

    $ docker compose up -f docker-compose-azure.yml
