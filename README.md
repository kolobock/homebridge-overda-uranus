
<p align="center">
  <a href="https://homebridge.io" title="Homebridge Verified" target="_blank"><img alt="Homebridge Verified" src="https://raw.githubusercontent.com/homebridge/branding/master/logos/homebridge-color-round-stylized.png" height="120"></a>
  <a href="https://overda.one" title="Homebridge Verified" target="_blank"><img src="https://overda.one/images/Overda%20Red%20Logo.png" height="120"></a>
</p>

# Overda Uranus/Retus Homebridge Platform Plugin

<span align="center">

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

    
[![npm](https://img.shields.io/npm/v/homebridge-overda-uranus/latest?label=latest)](https://www.npmjs.com/package/homebridge-overda-uranus)
[![npm](https://img.shields.io/npm/dt/homebridge-overda-uranus)](https://www.npmjs.com/package/homebridge-overda-uranus)

[![Build and Lint](https://github.com/kolobock/homebridge-overda-uranus/actions/workflows/build.yml/badge.svg)](https://github.com/kolobock/homebridge-overda-uranus/actions/workflows/build.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/kolobock/homebridge-overda-uranus/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kolobock/homebridge-overda-uranus?targetFile=package.json)

</span>

This is a Homebridge platform plugin for [Overda Uranus/Retus](https://overda.one) sensors.
Exposes sensors data from Overda Uranus or Retus air-monitor stations.

    
## Installation
```
sudo npm install -g homebridge-overda-uranus
```

## Configuration
    {
      "platform": "OverdaAirMonitor",
      "name": "Uranus",
      "updateInterval": 75, // Default 150, range 60..300
      "sensors": [
        {
          "displayName": "Uranus Leaving Room",
          "serialNumber": "URN-000000",
          "pass": "0000"
        },
        {
          "displayName": "Retus Bedroom",
          "serialNumber": "RTS-000000",
          "pass": "0000"
        }
      ]
    }

## Plugin pictures
All sensors<br>
<img width="853" alt="All Overda Sensors" src="https://user-images.githubusercontent.com/871452/132109938-89320e05-9993-4416-95ff-2f4d8e2a6f43.png">

IAQ sensor data<br>
<img width="801" alt="IAQ Sensor data" src="https://user-images.githubusercontent.com/871452/115158001-b6f44d80-a094-11eb-8e1d-92623c37472b.png">

Temperature sensor data<br>
<img width="795" alt="Temperature Sensor data" src="https://user-images.githubusercontent.com/871452/115157845-0b4afd80-a094-11eb-8f6c-d698ee46dd13.png">

Humidity sensor data<br>
<img width="798" alt="Humidity Sensor data" src="https://user-images.githubusercontent.com/871452/115158019-d55a4900-a094-11eb-9ac0-5ed33cf96a8a.png">

Battery Level sensor data<br>
<img width="801" alt="Battery Sensor data" src="https://user-images.githubusercontent.com/871452/115158041-f02cbd80-a094-11eb-92eb-0143c064e292.png">

Air Pressure Level sensor data<br>
<img width="812" alt="Air Pressure Level Sensor data" src="https://user-images.githubusercontent.com/871452/132109983-610a9061-4123-43c9-b28f-030fcca4199f.png">

No data sensors<br>
<img width="860" alt="No data NaN" src="https://user-images.githubusercontent.com/871452/132110018-2cf986ab-8b5d-4d29-a7f3-5bd55a616d1a.png">


### Overda DB json response example
    {"b":0.98,"h":47,"p":1012,"t":23.53,"v":92}
