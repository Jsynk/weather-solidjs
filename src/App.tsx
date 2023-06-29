import type { Component } from 'solid-js';
import { Routes, Route, A } from '@solidjs/router';
import { lazy } from "solid-js";

const Home = lazy(() => import("./pages/Home"));
const Map = lazy(() => import("./pages/Map"));

const App: Component = () => {
  return (
    <div class="flex flex-col min-h-screen">
      <div class="bg-primary text-primary-content">
        <div class="container navbar mx-auto">
          <A href='/' class="btn btn-ghost normal-case text-xl bi-clouds">Home</A>
          <A href='/map' class="btn btn-ghost normal-case text-xl bi-geo-alt">Map</A>
        </div>
      </div>

      <Routes>
        <Route path="/" component={Home} />
        <Route path="/map" component={Map} />
      </Routes>
    </div>
  );
};

export default App;
