import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { UranusPlatformAccessory } from './platformAccessory';

import AirPressure = require('./customCharacteristic');

let IAirPressureLevel;

export class UranusHomebridgePlatform implements DynamicPlatformPlugin {
  private AirPressureLevel;
  public readonly Service: typeof Service = this.api.hap.Service;
  public Characteristic: typeof Characteristic & typeof IAirPressureLevel;

  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', this.config.name);

    this.AirPressureLevel = AirPressure(this.api);
    IAirPressureLevel = this.AirPressureLevel;

    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      this.discoverSensors();
    });
    this.Characteristic = Object.defineProperty(this.api.hap.Characteristic, 'AirPressureLevel', {value: this.AirPressureLevel});
    // FIXME: need to properly define PropertyDescriptor for AirPressureLevel
    // Object.defineProperties(this.Characteristic, { 'AirPressureLevel': {value: this.AirPressureLevel} });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    this.accessories.push(accessory);
  }

  discoverSensors() {
    const uranusSensors = this.config.sensors;

    for (const sensor of uranusSensors) {
      const uuid = this.api.hap.uuid.generate(sensor.serialNumber);
      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      this.setDisplayName(sensor);

      if (existingAccessory) {
        this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

        existingAccessory.context.sensor = sensor;
        existingAccessory.displayName = sensor.displayName;

        try {
          new UranusPlatformAccessory(this, existingAccessory);
          this.api.updatePlatformAccessories([existingAccessory]);
        } catch (error) {
          this.log.error(`[${sensor.displayName}] has failed to updatePlatformAccessories:`, error.message);
        }
      } else {
        this.log.info('Adding new accessory:', sensor.displayName);

        const accessory = new this.api.platformAccessory(sensor.displayName, uuid);
        accessory.context.sensor = sensor;

        try {
          new UranusPlatformAccessory(this, accessory);
          this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        } catch (error) {
          this.log.error(`[${sensor.displayName}] has failed to registerPlatformAccessory:`, error.message);
        }
      }
    }
  }

  setDisplayName(sensor) {
    sensor.displayName = sensor.displayName || sensor.serialNumber;
  }
}
