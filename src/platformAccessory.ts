import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { UranusHomebridgePlatform } from './platform';
import https from 'https';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class UranusPlatformAccessory {
  private service: Service;

  private uranusStates = {
    Battery: 100,
    Humidity: 40,
    Pressure: 1000,
    Voc: 25,
    Temperature: 20,
  };

  private category = this.platform.api.hap.Categories.SENSOR;
  private displayName: string;
  private updateInterval: number;

  constructor(
    private readonly platform: UranusHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    this.displayName = accessory.context.device.displayName;
    this.updateInterval = parseInt(this.platform.config.updateInterval) || 150;
    this.platform.log.debug('Update Interval:', this.updateInterval, 's');

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Overda')
      .setCharacteristic(this.platform.Characteristic.Model, 'Uranus')
      .setCharacteristic(this.platform.Characteristic.FirmwareRevision, 'v1')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.device.serialNumber);

    this.service = this.accessory.getService(this.platform.Service.AirQualitySensor) ||
      this.accessory.addService(this.platform.Service.AirQualitySensor, `IAQ ${this.displayName}`);

    this.service.getCharacteristic(this.platform.Characteristic.AirQuality)
      .onGet(this.getIAQ.bind(this));
    this.service.getCharacteristic(this.platform.Characteristic.StatusLowBattery)
      .onGet(this.getBattery.bind(this));
    this.service.getCharacteristic(this.platform.Characteristic.VOCDensity)
      .onGet(this.getVoc.bind(this));

    const temperatureService: Service = this.accessory.getService(this.platform.Service.TemperatureSensor) ||
      this.accessory.addService(this.platform.Service.TemperatureSensor, `Temperature ${this.displayName}`);
    const humidityService: Service = this.accessory.getService(this.platform.Service.HumiditySensor) ||
      this.accessory.addService(this.platform.Service.HumiditySensor, `Humidity ${this.displayName}`);
    const batteryService: Service = this.accessory.getService(this.platform.Service.Battery) ||
      this.accessory.addService(this.platform.Service.Battery, `Battery level ${this.displayName}`);
    this.service.linkedServices = [temperatureService, humidityService, batteryService];

    temperatureService.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .onGet(this.getTemperature.bind(this));
    humidityService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .onGet(this.getHumidity.bind(this));
    batteryService.getCharacteristic(this.platform.Characteristic.StatusLowBattery)
      .onGet(this.getBattery.bind(this));
    batteryService.getCharacteristic(this.platform.Characteristic.BatteryLevel)
      .onGet(this.getBatteryLevel.bind(this));

    /**
     * Updating characteristics values asynchronously.
     */
    setInterval(() => {
      // push the new value to HomeKit
      this.updateStates.bind(this);
    }, this.updateInterval * 1000);
    this.updateStates.bind(this);
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getIAQ(): Promise<CharacteristicValue> {
    const voc = this.uranusStates.Voc;
    let IAQ;

    if (voc <= 50) {
      IAQ = this.platform.Characteristic.AirQuality.EXCELLENT;
    } else if (voc <= 100) {
      IAQ = this.platform.Characteristic.AirQuality.GOOD;
    } else if (voc <= 150) {
      IAQ = this.platform.Characteristic.AirQuality.FAIR;
    } else if (voc <= 200) {
      IAQ = this.platform.Characteristic.AirQuality.INFERIOR;
    } else if (voc <= 300) {
      IAQ = this.platform.Characteristic.AirQuality.POOR;
    } else {
      IAQ = this.platform.Characteristic.AirQuality.UNKNOWN;
    }

    this.platform.log.debug('Get Characteristic AirQuality ->', IAQ);

    return IAQ;
  }

  async getBattery(): Promise<CharacteristicValue> {
    let batteryLevel;

    if (this.uranusStates.Battery < 20) {
      batteryLevel = this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
    } else {
      batteryLevel = this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
    }

    this.platform.log.debug('Get Characteristic StatusLowBattery ->', batteryLevel);

    return batteryLevel;
  }

  async getBatteryLevel(): Promise<CharacteristicValue> {
    const batteryLevel = this.uranusStates.Battery;

    this.platform.log.debug('Get Characteristic BatteryLevel ->', batteryLevel);

    return batteryLevel;
  }

  async getTemperature(): Promise<CharacteristicValue> {
    const temperature = this.uranusStates.Temperature;

    this.platform.log.debug('Get Characteristic Temperature ->', temperature);

    return temperature;
  }

  async getVoc(): Promise<CharacteristicValue> {
    const voc = this.uranusStates.Voc;

    this.platform.log.debug('Get Characteristic Voc ->', voc);

    return voc;
  }

  async getHumidity(): Promise<CharacteristicValue> {
    const humidity = this.uranusStates.Humidity;

    this.platform.log.debug('Get Characteristic Humidity ->', humidity);

    return humidity;
  }

  getSensorData() {
    const overdaUrl = 'https://overda-database.firebaseio.com/Devices/Uranus/' +
                      this.accessory.context.device.serialNumber +
                      '-' +
                      this.accessory.context.device.pass +
                      '/Values.json';
    this.platform.log.info('overdaUrl:', overdaUrl);
    let rawData = '';
    let parsedData;

    https.get(overdaUrl, (res) => {
      res.setEncoding('utf8');
      res.on('data', (data) => {
        rawData += data;
      });
    }).on('error', (error) => {
      this.platform.log.error(error.message);
    }).on('end', () => {
      parsedData = JSON.parse(rawData);
      this.platform.log.info('Received data[end]:', parsedData);
    });

    this.platform.log.info('Received data[return]:', parsedData);
    return parsedData;
  }

  async updateStates(): Promise<void> {
    let data;
    try {
      this.platform.log.info('Requesting data...');
      data = this.getSensorData();
      this.platform.log.info('Received data:', data);
    } catch (error) {
      this.platform.log.info('Got error:', error.message);
      return;
    }

    if (!data) {
      return;
    }

    this.uranusStates.Battery = parseFloat(data.b) * 100;
    this.uranusStates.Humidity = data.h;
    this.uranusStates.Pressure = data.p;
    this.uranusStates.Temperature = data.t;
    this.uranusStates.Voc = data.v;
  }
}
