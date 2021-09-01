// OverdaSensor interface declares fields comes from config.schema.json
export declare interface OverdaSensor {
    serialNumber: string;
    pass: string;
    displayName: string;
}

// OverdaDataFormat defines all values that returned from Overda database for desired sensor
export declare interface OverdaDataFormat {
    b: number; // battery level: 0.1-1
    h: number; // humidity: 0-100%
    p: number; // atmospheric air pressure: 700-1300 hPa
    t: number; // temperature: -273-100 °C
    v: number; // VOC density: 0-500 µg/m³
}

// OverdaStates translates data format to user-friendly format
export declare interface OverdaStates {
    Battery: number;
    Humidity: number;
    Pressure: number;
    Temperature: number;
    Voc: number;
}