import { ItineraryProps, ItineraryPlace } from "./Itinerary";

export interface SavedItineraryProps extends ItineraryProps {
  id: string;
  userId: string;
  savedAt: Date;
  title?: string;
}

export class SavedItinerary {
  public readonly id: string;
  public readonly userId: string;
  public readonly savedAt: Date;
  public readonly title?: string;
  public readonly destination: string;
  public readonly bestTimeToVisit: string;
  public readonly estimatedDuration: string;
  public readonly places: ReadonlyArray<ItineraryPlace>;
  public readonly tips: ReadonlyArray<string>;
  public readonly generatedAt: Date;

  constructor(props: SavedItineraryProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.savedAt = props.savedAt;
    this.title = props.title;
    this.destination = props.destination;
    this.bestTimeToVisit = props.bestTimeToVisit;
    this.estimatedDuration = props.estimatedDuration;
    this.places = Object.freeze([...props.places]);
    this.tips = Object.freeze([...props.tips]);
    this.generatedAt = props.generatedAt;
  }

  public toJSON(): SavedItineraryProps {
    return {
      id: this.id,
      userId: this.userId,
      savedAt: this.savedAt,
      title: this.title,
      destination: this.destination,
      bestTimeToVisit: this.bestTimeToVisit,
      estimatedDuration: this.estimatedDuration,
      places: [...this.places],
      tips: [...this.tips],
      generatedAt: this.generatedAt,
    };
  }
}
