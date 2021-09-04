import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { OverdaPlatformAccessory } from './platformAccessory';

import { OverdaSensor } from './overda/overdaInterfaces';
import AirPressure = require('./overda/customCharacteristic');

let IAirPressureLevel;

export class OverdaHomebridgePlatform implements DynamicPlatformPlugin {
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
      try {
        this.discoverSensors();
      } catch (error) {
        this.log.error(`[${PLATFORM_NAME}] ${PLUGIN_NAME} has failed to discoverSensors:`, (error as Error).message);
      }
    });
    // Extends Characteristic for hap with custom AirPressureLevel.
    this.Characteristic = Object.defineProperty(this.api.hap.Characteristic, 'AirPressureLevel', {value: this.AirPressureLevel});
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    this.accessories.push(accessory);
  }

  discoverSensors() {
    const overdaSensors: Array<OverdaSensor> = this.config.sensors;

    for (const sensor of overdaSensors) {
      const uuid = this.api.hap.uuid.generate(sensor.serialNumber);
      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      this.setDisplayName(sensor);

      if (existingAccessory) {
        this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

        if (existingAccessory.displayName === sensor.displayName) {
          existingAccessory.context.sensor = sensor;
          try {
            new OverdaPlatformAccessory(this, existingAccessory);
            this.api.updatePlatformAccessories([existingAccessory]);
          } catch (error) {
            this.log.error(`[${sensor.displayName}] has failed to updatePlatformAccessories:`, (error as Error).message);
          }
          continue;
        }

        // unregister cached accessory if name from config not identical
        try {
          // new OverdaPlatformAccessory(this, existingAccessory);
          this.log.info('Unregistering existing accessory:', `${existingAccessory.displayName} -> ${sensor.displayName}`);
          this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
          // delete(this.accessories, existingAccessory);
        } catch (error) {
          this.log.error(`[${sensor.displayName}] has failed to unregisterPlatformAccessories:`, (error as Error).message);
        }
      }

      this.log.info('Adding new accessory:', sensor.displayName);

      const accessory = new this.api.platformAccessory(sensor.displayName, uuid);
      accessory.context.sensor = sensor;

      try {
        new OverdaPlatformAccessory(this, accessory);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      } catch (error) {
        this.log.error(`[${sensor.displayName}] has failed to registerPlatformAccessory:`, (error as Error).message);
      }
    }
  }

  // setDisplayName sets displayName as per config value or serialNumber
  setDisplayName(sensor: OverdaSensor) {
    sensor.displayName = sensor.displayName || sensor.serialNumber;
  }
}
