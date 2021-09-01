import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';
import { OverdaHomebridgePlatform } from './platform';
import { OverdaDataFormat, OverdaStates } from './overda/overdaInterfaces';

import https from 'https';

// OverdaPlatformAccessory defines all necessary methods to serve data from Retus or Uranus overda sensors
export class OverdaPlatformAccessory {
  private service: Service;
  private temperatureService: Service;
  private humidityService: Service;
  private batteryService: Service;

  private overdaStates: OverdaStates = {
    Battery: NaN,
    Humidity: NaN,
    Pressure: NaN,
    Voc: NaN,
    Temperature: NaN,
  };

  private category: number = this.platform.api.hap.Categories.SENSOR;
  private displayName: string;
  private updateInterval: number;
  private model: string;

  constructor(
    private readonly platform: OverdaHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.displayName = accessory.context.sensor.displayName;
    this.updateInterval = parseInt(this.platform.config.updateInterval) || 150;
    this.platform.log.info(`[${this.displayName}] Update Interval:`, this.updateInterval, 's');
    this.model = this.detectModel();

    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Overda')
      .setCharacteristic(this.platform.Characteristic.Model, this.model)
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

    this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor) ||
      this.accessory.addService(this.platform.Service.TemperatureSensor, `Temperature ${this.displayName}`);
    this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor) ||
      this.accessory.addService(this.platform.Service.HumiditySensor, `Humidity ${this.displayName}`);
    this.batteryService = this.accessory.getService(this.platform.Service.Battery) ||
      this.accessory.addService(this.platform.Service.Battery, `Battery level ${this.displayName}`);
    (this.temperatureService.getCharacteristic(this.platform.Characteristic.AirPressureLevel) ||
     this.temperatureService.addOptionalCharacteristic(this.platform.Characteristic.AirPressureLevel))
      .onGet(this.getAirPressure.bind(this));
    this.service.linkedServices = [this.temperatureService, this.humidityService, this.batteryService];

    this.temperatureService.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .onGet(this.getTemperature.bind(this));
    this.humidityService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .onGet(this.getHumidity.bind(this));
    this.batteryService.getCharacteristic(this.platform.Characteristic.StatusLowBattery)
      .onGet(this.getBattery.bind(this));
    this.batteryService.getCharacteristic(this.platform.Characteristic.BatteryLevel)
      .onGet(this.getBatteryLevel.bind(this));

    setInterval(() => {
      this.updateStates();
    }, this.updateInterval * 1000);
    this.updateStates();
  }

  async getIAQ(): Promise<CharacteristicValue> {
    const voc: number = this.overdaStates.Voc;
    let IAQ: number;

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

    this.platform.log.debug(`[${this.displayName}] Get Characteristic AirQuality ->`, IAQ);

    return IAQ;
  }

  async getBattery(): Promise<CharacteristicValue> {
    let batteryLevel: number;

    if (this.overdaStates.Battery < 20) {
      batteryLevel = this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW;
    } else {
      batteryLevel = this.platform.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
    }

    this.platform.log.debug(`[${this.displayName}] Get Characteristic StatusLowBattery ->`, batteryLevel);

    return batteryLevel;
  }

  async getBatteryLevel(): Promise<CharacteristicValue> {
    const batteryLevel: number = this.overdaStates.Battery;

    this.platform.log.debug(`[${this.displayName}] Get Characteristic BatteryLevel ->`, batteryLevel);

    return this.promise(batteryLevel);
  }

  async getTemperature(): Promise<CharacteristicValue> {
    const temperature: number = this.overdaStates.Temperature;

    this.platform.log.debug(`[${this.displayName}] Get Characteristic Temperature ->`, temperature);

    return this.promise(temperature);
  }

  async getVoc(): Promise<CharacteristicValue> {
    const voc: number = this.overdaStates.Voc;

    this.platform.log.debug(`[${this.displayName}] Get Characteristic VocDensity ->`, voc);

    return this.promise(voc);
  }

  async getAirPressure(): Promise<CharacteristicValue> {
    const pressure: number = this.overdaStates.Pressure;

    this.platform.log.debug(`[${this.displayName}] Get Characteristic Pressure ->`, pressure);

    return this.promise(pressure);
  }

  async getHumidity(): Promise<CharacteristicValue> {
    const humidity: number = this.overdaStates.Humidity;

    this.platform.log.debug(`[${this.displayName}] Get Characteristic Humidity ->`, humidity);

    return this.promise(humidity);
  }

  getSensorData(): Promise<OverdaDataFormat> {
    const overdaUrl: string = `https://overda-database.firebaseio.com/Devices/${this.model}/` +
                              this.accessory.context.sensor.serialNumber +
                              '-' +
                              this.accessory.context.sensor.pass +
                              '/Values.json';
    this.platform.log.debug(`[${this.displayName}] overdaUrl:`, overdaUrl);

    let rawData = '';

    return new Promise((resolve, reject) => {
      https.get(overdaUrl, (res) => {
        res.setEncoding('utf8');
        res.on('data', (data) => {
          rawData += data;
        });
        res.on('end', () => {
          const parsedData: OverdaDataFormat = JSON.parse(rawData);
          if(parsedData['error'] !== undefined) {
            reject(new Error(parsedData['error']));
          }

          resolve(parsedData);
        });
      }).on('error', (error) => {
        this.platform.log.error(`[${this.displayName}] ${error.message}`);
        reject(error);
      });
    });
  }

  async updateStates(): Promise<void> {
    let tmpData;
    try {
      tmpData = await this.getSensorData();
      this.platform.log.debug(`[${this.displayName}] Received data:`, tmpData);
    } catch (error) {
      this.platform.log.warn(`[${this.displayName}] Got error retrieving data:`, (error as Error).message);
      return;
    }

    if (!tmpData) {
      return;
    }
    const data: OverdaDataFormat = tmpData;

    this.overdaStates.Battery = data.b * 100;
    this.platform.log.info(`[${this.displayName}] Measured Battery Level ->`, this.overdaStates.Battery, '%');
    this.overdaStates.Humidity = data.h;
    this.platform.log.info(`[${this.displayName}] Measured Humidity ->`, this.overdaStates.Humidity, '%');
    this.overdaStates.Pressure = data.p;
    this.platform.log.info(`[${this.displayName}] Measured Air Pressure ->`, this.overdaStates.Pressure, 'hPa');
    this.overdaStates.Temperature = data.t;
    this.platform.log.info(`[${this.displayName}] Measured Temperature ->`, this.overdaStates.Temperature, '°C');
    this.overdaStates.Voc = data.v;
    this.platform.log.info(`[${this.displayName}] Measured VOC Density ->`, this.overdaStates.Voc, 'µg/m³');

    this.platform.log.debug(`[${this.displayName}] Updating Characteristic Pressure ->`, data.p);
    this.temperatureService.updateCharacteristic(this.platform.Characteristic.AirPressureLevel, await this.getAirPressure());

    this.platform.log.debug(`[${this.displayName}] Updating Characteristic Battery Level ->`, data.b);
    this.batteryService.updateCharacteristic(this.platform.Characteristic.BatteryLevel, await this.getBatteryLevel());

    this.platform.log.debug(`[${this.displayName}] Updating Characteristic Humidity ->`, data.h);
    this.humidityService.updateCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, await this.getHumidity());

    this.platform.log.debug(`[${this.displayName}] Updating Characteristic Temperature ->`, data.t);
    this.temperatureService.updateCharacteristic(this.platform.Characteristic.CurrentTemperature, await this.getTemperature());

    this.platform.log.debug(`[${this.displayName}] Updating Characteristic VOC ->`, data.v);
    this.service.updateCharacteristic(this.platform.Characteristic.VOCDensity, await this.getVoc());

    const IAQ: CharacteristicValue = await this.getIAQ();
    this.platform.log.debug(`[${this.displayName}] Updating Characteristic IAQ ->`, IAQ);
    this.service.updateCharacteristic(this.platform.Characteristic.AirQuality, IAQ);

    const LowBatt: CharacteristicValue = await this.getBattery();
    this.platform.log.debug(`[${this.displayName}] Updating Characteristic StatusLowBattery ->`, LowBatt);
    this.batteryService.updateCharacteristic(this.platform.Characteristic.StatusLowBattery, LowBatt);
  }

  detectModel(): string {
    if (this.accessory.context.sensor.serialNumber.indexOf('URN') >= 0) {
      return 'Uranus';
    }

    return 'Retus';
  }

  promise(param: number): Promise<CharacteristicValue> {
    return new Promise((resolve, reject) => {
      isNaN(param) ? reject(param) : resolve(param);
    });
  }
}
