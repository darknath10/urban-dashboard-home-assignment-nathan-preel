import { BookmarkedLocation } from './bookmarked-location';

export type LocationBookmarkPayload = Omit<BookmarkedLocation, 'id'>;
