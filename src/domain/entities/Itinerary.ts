export interface ItineraryPlace {
  name: string;
  description: string;
  category: string;
  estimatedVisitTime: string;
}

export interface ItineraryProps {
  destination: string;
  bestTimeToVisit: string;
  estimatedDuration: string;
  places: ItineraryPlace[];
  tips: string[];
  generatedAt: Date;
}

export class Itinerary {
  public readonly destination: string;
  public readonly bestTimeToVisit: string;
  public readonly estimatedDuration: string;
  public readonly places: ReadonlyArray<ItineraryPlace>;
  public readonly tips: ReadonlyArray<string>;
  public readonly generatedAt: Date;

  constructor(props: ItineraryProps) {
    this.destination = props.destination;
    this.bestTimeToVisit = props.bestTimeToVisit;
    this.estimatedDuration = props.estimatedDuration;
    this.places = Object.freeze([...props.places]);
    this.tips = Object.freeze([...props.tips]);
    this.generatedAt = props.generatedAt;
  }

  public toJSON(): ItineraryProps {
    return {
      destination: this.destination,
      bestTimeToVisit: this.bestTimeToVisit,
      estimatedDuration: this.estimatedDuration,
      places: [...this.places],
      tips: [...this.tips],
      generatedAt: this.generatedAt,
    };
  }
}
