import { ValidationError } from "../../shared/errors/ValidationError";

interface GeolocationProps {
  lat: number;
  lng: number;
}

export class Geolocation {
  public readonly lat: number;
  public readonly lng: number;

  constructor({ lat, lng }: GeolocationProps) {
    Geolocation.validate(lat, lng);
    this.lat = lat;
    this.lng = lng;
  }

  private static validate(lat: number, lng: number): void {
    if (lat < -90 || lat > 90) {
      throw new ValidationError(
        `Latitude must be between -90 and +90, received: ${lat}`,
        "lat"
      );
    }

    if (lng < -180 || lng > 180) {
      throw new ValidationError(
        `Longitude must be between -180 and +180, received: ${lng}`,
        "lng"
      );
    }
  }

  public toString(): string {
    return `${this.lat},${this.lng}`;
  }
}
