import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { UranusHomebridgePlatform } from './platform';
import https from 'https';

export class UranusPlatformAccessory {
  private service: Service;

  private uranusStates = {
    Battery: 0,
    Humidity: 0,
    Pressure: 1000,
    Voc: 0,
    Temperature: 0,
  };

  private category = this.platform.api.hap.Categories.SENSOR;
  private displayName: string;
  private updateInterval: number;

  constructor(
    private readonly platform: UranusHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    this.displayName = accessory.context.sensor.displayName;
    this.updateInterval = parseInt(this.platform.config.updateInterval) || 150;
    this.platform.log.info('Update Interval:', this.updateInterval, 's');

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Overda')
      .setCharacteristic(this.platform.Characteristic.Model, 'Uranus')
      .setCharacteristic(this.platform.Characteristic.FirmwareRevision, 'v1')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, accessory.context.sensor.serialNumber);

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
      this.updateStates();
    }, this.updateInterval * 1000);
    this.updateStates();
  }

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
                      this.accessory.context.sensor.serialNumber +
                      '-' +
                      this.accessory.context.sensor.pass +
                      '/Values.json';
    this.platform.log.debug('overdaUrl:', overdaUrl);

    let rawData = '';

    return new Promise((resolve, reject) => {
      https.get(overdaUrl, (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
          rawData += data;
        });
        res.on('end', () => {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        });
      }).on('error', (error) => {
        this.platform.log.error(error.message);
        reject(error);
      });
    });
  }

  async updateStates(): Promise<void> {
    let data;
    try {
      data = await this.getSensorData();
      this.platform.log.debug('Received data:', data);
    } catch (error) {
      this.platform.log.warn('Got error retrieving data:', error.message);
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
