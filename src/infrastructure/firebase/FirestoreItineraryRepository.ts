import { Timestamp } from "firebase-admin/firestore";
import { db } from "./firebaseAdmin";
import { ItineraryRepository } from "../../domain/interfaces/ItineraryRepository";
import { ItineraryProps } from "../../domain/entities/Itinerary";
import { SavedItinerary } from "../../domain/entities/SavedItinerary";
import { AppError } from "../../shared/errors/AppError";

const COLLECTION = "users";
const SUB_COLLECTION = "itineraries";

function itinerariesRef(userId: string) {
  return db.collection(COLLECTION).doc(userId).collection(SUB_COLLECTION);
}

function docToSavedItinerary(
  id: string,
  userId: string,
  data: FirebaseFirestore.DocumentData
): SavedItinerary {
  return new SavedItinerary({
    id,
    userId,
    title: data.title ?? undefined,
    savedAt: (data.savedAt as Timestamp).toDate(),
    destination: data.destination,
    bestTimeToVisit: data.bestTimeToVisit,
    estimatedDuration: data.estimatedDuration,
    places: data.places,
    tips: data.tips,
    generatedAt: (data.generatedAt as Timestamp).toDate(),
  });
}

export class FirestoreItineraryRepository implements ItineraryRepository {
  async save(
    userId: string,
    itinerary: ItineraryProps,
    title?: string
  ): Promise<SavedItinerary> {
    const ref = itinerariesRef(userId).doc();

    const savedAt = Timestamp.now();

    await ref.set({
      title: title ?? null,
      savedAt,
      destination: itinerary.destination,
      bestTimeToVisit: itinerary.bestTimeToVisit,
      estimatedDuration: itinerary.estimatedDuration,
      places: itinerary.places,
      tips: itinerary.tips,
      generatedAt: Timestamp.fromDate(itinerary.generatedAt),
    });

    return new SavedItinerary({
      id: ref.id,
      userId,
      title,
      savedAt: savedAt.toDate(),
      destination: itinerary.destination,
      bestTimeToVisit: itinerary.bestTimeToVisit,
      estimatedDuration: itinerary.estimatedDuration,
      places: itinerary.places,
      tips: itinerary.tips,
      generatedAt: itinerary.generatedAt,
    });
  }

  async findAllByUser(userId: string): Promise<SavedItinerary[]> {
    const snapshot = await itinerariesRef(userId)
      .orderBy("savedAt", "desc")
      .get();

    return snapshot.docs.map((doc) =>
      docToSavedItinerary(doc.id, userId, doc.data())
    );
  }

  async findById(
    userId: string,
    id: string
  ): Promise<SavedItinerary | null> {
    const doc = await itinerariesRef(userId).doc(id).get();

    if (!doc.exists) return null;

    return docToSavedItinerary(doc.id, userId, doc.data()!);
  }

  async delete(userId: string, id: string): Promise<void> {
    const ref = itinerariesRef(userId).doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      throw new AppError("Itinerary not found", 404);
    }

    await ref.delete();
  }

  async countByUser(userId: string): Promise<number> {
    const snapshot = await itinerariesRef(userId).count().get();
    return snapshot.data().count;
  }
}
