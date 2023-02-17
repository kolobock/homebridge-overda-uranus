# Change Log

## Unreleased ()

## v5.1.0 (2022-02-17)

### What's Changed
* Bump actions/setup-node from 3.4.1 to 3.6.0 by @dependabot in https://github.com/kolobock/homebridge-overda-uranus/pull/263
* Bump nodemon from 2.0.19 to 2.0.20 by @dependabot in https://github.com/kolobock/homebridge-overda-uranus/pull/215
* Bump typescript from 4.8.2 to 4.9.5 by @dependabot in https://github.com/kolobock/homebridge-overda-uranus/pull/273
* Bump eslint from 8.22.0 to 8.34.0 by @dependabot in https://github.com/kolobock/homebridge-overda-uranus/pull/277
* Bump @typescript-eslint/eslint-plugin from 5.35.1 to 5.52.0 by @dependabot in https://github.com/kolobock/homebridge-overda-uranus/pull/278
* Bump @typescript-eslint/parser from 5.35.1 to 5.52.0 by @dependabot in https://github.com/kolobock/homebridge-overda-uranus/pull/279


### Breaking Changes:

* Minimum supported `node` version from v16.13.0 or v18.7.0

**Full Changelog**: https://github.com/kolobock/homebridge-overda-uranus/compare/v5.0.1...v5.1.0


## v5.0.0 (2022-08-26)

### Breaking Changes:

* Minimum supported `homebridge` version from v1.5.0
* Minimum supported `node` version from v14.18.0 or v16.13.0 or v18.7.0
 
### Misc

* Bump @types/node from 16.11.19 to 16.11.21
* Bump eslint from 8.6.0 to 8.7.0
* Bump @typescript-eslint/eslint-plugin from 5.9.0 to 5.35.1
* Bump @typescript-eslint/parser from 5.9.0 to 5.35.1
* Bump homebridge from 1.3.9 to 1.5.0
* Bump typescript from 4.5.2 to 4.8.2
* Bump minimist from 1.2.5 to 1.2.6 
* Bump actions/checkout from 2 to 3
* Bump github/codeql-action from 1 to 2
* Bump actions/setup-node from 2.5.1 to 3.4.1


## v4.2.2 (2022-01-06)

### Misc

* Bump homebridge from 1.3.6 to 1.3.9
* Bump typescript from 4.5.2 to 4.5.4
* Bump actions/setup-node from 2.4.1 to 2.5.1
* Bump eslint from 8.3.0 to 8.6.0
* Bump @typescript-eslint/eslint-plugin from 5.4.0 to 5.9.0
* Bump @typescript-eslint/parser from 5.4.0 to 5.9.0
* Bump @types/node from 16.11.9 to 16.11.19


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
