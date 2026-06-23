
export type Tag = "painting" | "wall art" | "digital" | "sketch";
export type Status = "scheduled" | "live" | "ended";

export interface Artwork {
  _id: string;
  title: string;
  imageURL: string;
  tags: string[];
  startingPrice: number;
  ownerId?: string;
  status?: Status;      
  startTime?: string;
  endTime?: string;
}

export interface NewArtwork {
  title: string;
  imageURL: string;
  tags: Tag[];
  startingPrice: number;
  startTime?: string;
  endTime?: string;
}