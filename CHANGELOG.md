# Change Log

## Unreleased ()


## v4.2.1 (2021-11-22)

### Breaking Changes

* remove support for Node v10.x/v13.x/v15.x

### Misc

* Bump actions/setup-node from 2.4.0 to 2.4.1
* update all npm modules by dependency VSC extension
* Bump homebridge from 1.3.5 to 1.3.6
* Bump nodemon from 2.0.13 to 2.0.15
* Bump ts-node from 10.2.1 to 10.4.0
* Bump typescript from 4.4.3 to 4.5.2
* Bump eslint from 7.32.0 to 8.3.0


## v4.1.1 (2021-09-23)

### Misc

* remove commented lines of code (code cleanup)
* bump deep-is v0.1.3 -> v0.1.4 node module
* remove njsscan analysis from repo
* add contributing to repo
* add code of conduct to repo
* bump actions/setup-node from 1 to 2.4.0
* bump @types/node from 14.17.14 to 16.9.6
* bump ts-node from 9.1.1 to 10.2.1
* bump @typescript-eslint/parser from 4.30.0 to 4.31.2
* bump @typescript-eslint/eslint-plugin from 4.30.0 to 4.31.2
* bump typescript from 4.4.2 to 4.4.3
* bump ansi-regex-5.0.0 to 5.0.1 [CVE-2021-3807](https://github.com/advisories/GHSA-93q8-gq69-wqmw)
* bump typescript other dependencies


## v4.1.0 (2021-09-05)

### Code improvements

* Udate sensor display name if changed in config

### Misc

* update pictures in README
* add codeql analysis
* add njsscan analysis

## v4.0.0 (2021-09-04)

### Code improvements

* Show Air Pressure Level as value for Occupancy sensor

### Misc

* add npm package publish-related scripts

## v3.1.0 (2021-09-01)

### Code improvements

* Properly handle NaN sensor's values


## v3.0.1 (2021-09-01)

* Update overda picture in README


## v3.0.0 (2021-09-01)

### Breaking changes

* ! Platform name ~OverdaUranus~ replaced with `OverdaAirMonitor`

### Plugin support

* add support for Retus air monitor station

### Code improvements

*update nodejs dependencies


## v2.2.3 (2021-06-13)

### Plugin misc

* add Homebridge icon to README
* add homebridge:verified to README
* add funding with paypal option


## v2.2.2 (2021-06-12)

### Code improvements

* catch exceptions on plugin discovering start
* Upgrade npm modules to fix vulnerabilities
* use proxy variable to carry UranusDataFormat

### Update README


## v2.1.3 (2021-04-21)

### Code improvements

* Show measured data in log on fetching remote data
* Update accessory name if it has changed in config


## v2.1.2 (2021-04-20)

### Update Readme with pictures


## v2.1.1 (2021-04-20)

### Code improvements

* Add sensor name to log messages


## v2.1.0 (2021-04-17)

### Fixes

* Do not import from `hap-nodejs`, use `homebridge` instead

### Code Cleanup

* Removed extra comments


## v2.0.0 (2021-04-17)

### Code improvements

* Add AirPressureLevel custom Characteristic


## v1.0.7 (2021-03-28)

Overda Uranus Homebridge Plugin first stable release
