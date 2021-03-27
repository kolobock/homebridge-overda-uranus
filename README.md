
<p align="center">

<img src="https://overda.one/img/Uranus-Light.png" width="150">

</p>


# Overda Uranus Homebridge Platform Plugin

This is a Homebridge platform plugin for [Overda Uranus](https://overda.one) sensors.

## Installation
```
sudo npm install -g homebridge-overda-uranus@beta
```

## Configuration

    {
      "platform": "OverdaUranus",
      "name": "Uranus",
      "updateInterval": 75, // Default 150, range 60..300
      "sensors": [
        {
          "displayName": "Uranus Leaving Room",
          "serialNumber": "URN-000000",
          "pass": "0000"
        }
      ]
    }
