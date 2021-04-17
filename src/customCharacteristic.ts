import { Formats, Perms } from 'homebridge';

export = (homebridge) => {
  const Characteristic = homebridge.hap.Characteristic;

  return class AirPressureLevel extends Characteristic {
    public static readonly UUID: string = '0000007C-0000-1000-8000-0026BB765291';

    constructor() {
      super('Air Pressure', AirPressureLevel.UUID, {
        format: Formats.UINT16,
        unit: 'mbar',
        minValue: 800,
        maxValue: 1200,
        minStep: 0.5,
        perms: [Perms.READ, Perms.NOTIFY],
      });
      this.value = this.getDefaultValue();
    }
  };
};
