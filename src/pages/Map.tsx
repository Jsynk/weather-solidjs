import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map as MapType, Marker, Circle, LeafletMouseEvent } from 'leaflet'

import { onMount, onCleanup } from 'solid-js'
import { A } from '@solidjs/router';
import { selectedLocation, setSelectedLocation, Location } from '../store';

interface MarkerLocation {
  latitude: number,
  longitude: number,
  accuracy: number | undefined
}

export default function Map() {
  let mapParentDiv: any;
  let mapDiv: any;
  let marker: Marker;
  let circle: Circle;
  let map: MapType;

  const buildMap = (div: HTMLDivElement) => {
    let [lat, lon] = [59.34147877771978, 18.065450191497806]
    if(selectedLocation.latitude != null && selectedLocation.longitude != null) {
      [lat, lon] = [selectedLocation.latitude, selectedLocation.longitude]
    }

    map = L.map(div).setView([lat, lon], 15);

    if(selectedLocation.latitude != null && selectedLocation.longitude != null) {
      marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`Selected location<br>Latitude: ${lat.toFixed(4)}, Longitude: ${lon.toFixed(4)}`)
        .openPopup();
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', onMapClick);
  }

  const setMapPosition = ({ latitude, longitude, accuracy }: MarkerLocation) => {
    if (marker) {
      map.removeLayer(marker)
    }
    if (circle) {
      map.removeLayer(circle);
    }
    marker = L.marker([latitude, longitude]).addTo(map)
      .bindPopup(`Selected location<br>Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`)
      .openPopup();
    if (accuracy) {
      circle = L.circle([latitude, longitude], { radius: accuracy }).addTo(map);
    }

    setSelectedLocation(new Location(latitude, longitude, null, null))
  }

  const onMapClick = (e: LeafletMouseEvent) => {
    setMapPosition({ latitude: e.latlng.lat, longitude: e.latlng.lng, accuracy: undefined })
  }

  const selectGeoLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;

      map.setView([lat, lng])
      setMapPosition({ latitude: lat, longitude: lng, accuracy: accuracy })
    },
      (err) => {
        if (err.code === 1) {
          alert("Please allow geolocation access");
        } else {
          alert("Cannot get current location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
  }

  const checkLocationWeather = () => { 
    homeLink.click() 
  }

  const checkLocationWeatherDisabled = () => { 
    return selectedLocation.latitude != null && selectedLocation.data == null ? false: true
  }

  let homeLink: any

  onMount(() => { 
    buildMap(mapDiv)
  })

  return (
    <div class="relative flex-grow" ref={mapParentDiv}>
      <div ref={mapDiv} class="absolute top-0 bottom-0 left-0 right-0"></div>
      <div class="fixed bottom-0 left-0 right-0" style="z-index:420;">
        <div class="container mx-auto">
          <div class="grid gap-4 grid-cols-2 p-3 max-w-lg">
            <button class="btn btn-primary normal-case" onClick={selectGeoLocation}>Go to my GPS location</button>
            <button disabled={checkLocationWeatherDisabled()} class="btn btn-primary normal-case" onClick={checkLocationWeather}>Check weather at selected location</button>
            <A ref={homeLink} href="/"></A>
          </div>
        </div>
      </div>
    </div>
  )
}
