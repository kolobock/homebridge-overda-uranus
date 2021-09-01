/**
 * customCharacteristic allows to observe Air Pressure level in Homebridge Web page
 * this is not visible in Homebridge application though because Apple does not support AirPressure Characteristic
 */
import { Formats, Perms } from 'homebridge';

export = (homebridge) => {
  const Charact = homebridge.hap.Characteristic;

  return class AirPressureLevel extends Charact {
    public static readonly UUID: string = '0000007C-0000-1000-8000-0026BB765291';

    constructor() {
      super('Air Pressure', AirPressureLevel.UUID, {
        format: Formats.UINT16,
        unit: 'mbar',
        minValue: 700,
        maxValue: 1300,
        minStep: 0.5,
        perms: [Perms.PAIRED_READ, Perms.NOTIFY],
      });
      this.value = this.getDefaultValue();
    }
  };
};
