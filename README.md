
<p align="center">

<img src="https://overda.one/img/Uranus-Light.png" width="150">

</p>


# Overda Uranus Homebridge Platform Plugin

This is a Homebridge platform plugin for [Overda Uranus](https://overda.one) sensors.
Exposes sensors data from Uranus air-monitor station.

## Installation
```
sudo npm install -g homebridge-overda-uranus
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

### Uranus DB json response example
    {"b":0.98,"h":47,"p":1012,"t":23.53,"v":92}
