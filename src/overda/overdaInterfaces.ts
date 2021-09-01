// OverdaSensor interface declares fields comes from config.schema.json
export interface OverdaSensor {
    serialNumber: string;
    pass: string;
    displayName: string;
}

// OverdaDataFormat defines all values that returned from Overda database for desired sensor
export interface OverdaDataFormat {
    b: number; // battery level: 0.1-1
    h: number; // humidity: 0-100%
    p: number; // atmospheric air pressure: 700-1300 hPa
    t: number; // temperature: -273-100 °C
    v: number; // VOC density: 0-500 µg/m³
}
