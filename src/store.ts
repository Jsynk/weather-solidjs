import { createStore } from "solid-js/store";
import type { WeatherData } from './types/weather'

export class Location {
    latitude: number|null
    longitude: number|null
    time: number|null
    data: WeatherData|null
    constructor(latitude: number|null, longitude: number|null, time: number|null, data: WeatherData|null) {
        this.latitude = latitude
        this.longitude = longitude
        this.time = time
        this.data = data
    }
}

const [selectedLocation, setSelectedLocation] = createStore(new Location(null, null, null, null))
export { selectedLocation, setSelectedLocation }