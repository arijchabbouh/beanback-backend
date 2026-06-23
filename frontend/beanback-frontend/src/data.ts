import type { Artwork, Tag } from "./types";

export const TAG_OPTIONS: Tag[] = ["painting", "wall art", "digital", "sketch"];

export const SAMPLE_OWNER_ID = "507f1f77bcf86cd799439011";

export const DEMO_ARTWORKS: Artwork[] = [
  { _id: "demo1", title: "Harbour at First Light", imageURL: "https://picsum.photos/seed/harbour/600/750", tags: ["painting"], startingPrice: 240, status: "live" },
  { _id: "demo2", title: "Static Bloom", imageURL: "https://picsum.photos/seed/bloom/600/750", tags: ["digital", "wall art"], startingPrice: 95, status: "scheduled" },
  { _id: "demo3", title: "Study of Hands, No. 4", imageURL: "https://picsum.photos/seed/hands/600/750", tags: ["sketch"], startingPrice: 60, status: "ended" },
  { _id: "demo4", title: "Pocket Garden", imageURL: "https://picsum.photos/seed/garden/600/750", tags: ["painting"], startingPrice: 35, status: "scheduled" },
  { _id: "demo5", title: "Notes in Blue", imageURL: "https://picsum.photos/seed/notes/600/750", tags: ["sketch", "digital"], startingPrice: 42, status: "live" },
];