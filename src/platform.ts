import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { UranusPlatformAccessory } from './platformAccessory';

import { AirPressureLevel } from './customCharacteristic';

export class UranusHomebridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public Characteristic: any;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', this.config.name);

    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your sensors as accessories
      this.discoverSensors();
    });
    this.Characteristic = Object.defineProperty(this.api.hap.Characteristic, 'AirPressureLevel', {value: AirPressureLevel});
    // FIXME: need to properly define PropertyDescriptor for AirPressureLevel
    Object.defineProperties(this.api.hap.Characteristic,  { 'AirPressureLevel': {value: AirPressureLevel} });
  }

  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  discoverSensors() {
    const uranusSensors = this.config.sensors;

    // loop over the discovered sensors and register each one if it has not already been registered
    for (const sensor of uranusSensors) {

      // generate a unique id for the accessory this should be generated from
      // something globally unique, but constant, for example, the sensor serial
      // number or MAC address
      const uuid = this.api.hap.uuid.generate(sensor.serialNumber);

      // see if an accessory with the same uuid has already been registered and restored from
      // the cached sensors we stored in the `configureAccessory` method above
      const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

      if (existingAccessory) {
        // the accessory already exists
        this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);

        // if you need to update the accessory.context then you should run `api.updatePlatformAccessories`. eg.:
        existingAccessory.context.sensor = sensor;
        this.api.updatePlatformAccessories([existingAccessory]);

        // create the accessory handler for the restored accessory
        // this is imported from `platformAccessory.ts`
        new UranusPlatformAccessory(this, existingAccessory);

        // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
        // remove platform accessories when no longer present
        // this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
        // this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
      } else {
        // the accessory does not yet exist, so we need to create it
        this.log.info('Adding new accessory:', sensor.displayName);

        // create a new accessory
        const accessory = new this.api.platformAccessory(sensor.displayName, uuid);

        // store a copy of the sensor object in the `accessory.context`
        // the `context` property can be used to store any data about the accessory you may need
        accessory.context.sensor = sensor;

        // create the accessory handler for the newly create accessory
        // this is imported from `platformAccessory.ts`
        new UranusPlatformAccessory(this, accessory);

        // link the accessory to your platform
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      }
    }
  }
}
