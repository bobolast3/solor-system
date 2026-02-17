import * as THREE from "three";

export interface MoonOptions {
  name: string;
  radius: number;
  distance: number;
  orbitPeriod: number;
  rotationPeriod: number;
  textureURL?: string;
}

export interface RingOptions {
  innerRadius: number;
  outerRadius: number;
  textureURL?: string;
}

export interface PlanetOptions {
  name: string;
  radius: number;
  distance: number;
  orbitPeriod: number;
  rotationPeriod: number;
  textureURL?: string;
  moons?: MoonOptions[];
  ring?: RingOptions;
  info?: PlanetInfo;
}

export interface CelestialOptions {
  name: string;
  radius: number;
  textureURL?: string;
  rotationPeriod?: number;
  info?: Record<string, any>;
}

export interface PlanetInfo {
  mass?: string;
  gravity?: string;
  distanceFromSun?: string;
  numberOfMoons?: number;
  atmosphere?: string;
  composition?: string;
  [key: string]: any;
}

export interface StarFieldOptions {
  count?: number;
  radius?: number;
  minSize?: number;
  maxSize?: number;
  colors?: THREE.Color[];
  seed?: number;
}
