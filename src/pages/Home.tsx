import { Show, For, createResource } from 'solid-js';
import { onMount } from 'solid-js'
import { A } from '@solidjs/router';
import { selectedLocation, setSelectedLocation } from '../store';
import type { WeatherData } from '../types/weather'

const VITE_OPEN_WEATHER_MAP_API_KEY = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY || ''
export default function Home() {
    const checkWeather = () => {
        return selectedLocation.latitude == null || selectedLocation.longitude == null ? false : true
    }
    const fetchWeatherData = async () => {
        if(!checkWeather()) {
            return null
        }
        const cacheTime = 1000*60*60*24
        const timePassed = new Date().getTime() - (selectedLocation.time || 0)
        if(selectedLocation.data && timePassed < cacheTime) {
            return selectedLocation.data
        }
        const [lat, lon, units, exclude, appid] = [selectedLocation.latitude, selectedLocation.longitude, 'metric', 'minutely,hourly,alerts', VITE_OPEN_WEATHER_MAP_API_KEY]
        let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=${exclude}&appid=${appid}`
        if(!VITE_OPEN_WEATHER_MAP_API_KEY) {
            url = `/api/weather.json`
        }
        const res = await fetch(url)
        const json = await res.json()
        setSelectedLocation('time', new Date().getTime())
        setSelectedLocation('data', json)
        return json
    }

    const [weatherData] = createResource<WeatherData>(fetchWeatherData)
    let mapLink: any
    onMount(() => {
        if(!checkWeather()) {
            mapLink.click()
        }
    })
    return (
        <div class="container mx-auto p-4 text-primary-content ">
            <div class="grid grid-cols-1 gap-6">
                <Show when={!checkWeather()}>
                    <div class="card bg-primary p-4">
                        <A class="btn btn-primary normal-case text-xl bi-geo-alt" href='/map'>Select a location</A>
                    </div>
                </Show>
                
                <Show when={checkWeather() && !weatherData()}>
                    <div class="card bg-primary p-4">
                        Loading...
                    </div>
                </Show>
                <Show when={weatherData()} >
                    <div class="card text-secondary-content bg-secondary p-4 text-3xl">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>
                        <div class="bi-calendar italic "> Today {weatherData()?.timezone}
                            <label class="bi-thermometer-low font-bold text-5xl">{Math.round(weatherData()?.current.temp||0)}℃</label>
                        </div>
                        <div class="bi-wind"> {weatherData()?.current.wind_speed}m/sec</div>
                        <div class="bi-clouds"> {weatherData()?.current.clouds}%</div>
                        <div class="bi-clouds"> {weatherData()?.current.weather[0].main}({weatherData()?.current.weather[0].description})</div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <For each={weatherData()?.daily}>
                        {(daily)=>(
                        <div class="card bg-primary text-primary-content p-4">
                            <div class="bi-calendar italic"> {new Date(daily.dt*1000).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                            <div class="bi-thermometer-low font-bold text-2xl"> {Math.round(daily.temp.day)}℃</div>
                            <div class="bi-clouds"> {daily.clouds}%</div>
                            <div class="bi-cloud-rain"> {daily.weather[0].main}({daily.weather[0].description})</div>
                        </div>
                        )}
                        </For>
                    </div>
                </Show>

                <A ref={mapLink} href="/map"></A>
            </div>
        </div>
    )
}