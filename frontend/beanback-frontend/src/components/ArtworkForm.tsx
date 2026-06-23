import { useState } from "react";
import type { NewArtwork, Tag } from "../types";
import { TAG_OPTIONS } from "../data";

interface Props {
  onAdd: (artwork: NewArtwork) => Promise<void>;
}

export default function ArtworkForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  function toggleTag(tag: Tag) {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  async function submit() {
    setError("");
    if (!title.trim() || !imageURL.trim() || startingPrice === "") {
      setError("Title, image URL and a starting price are all required.");
      return;
    }
    try {
      await onAdd({
        title: title.trim(),
        imageURL: imageURL.trim(),
        tags,
        startingPrice: Number(startingPrice),
        startTime: startTime || undefined,   // send only if filled in
        endTime: endTime || undefined,
      });
      setTitle(""); setImageURL(""); setStartingPrice(""); setTags([]);
      setStartTime(""); setEndTime("");
    } catch {
      setError("Couldn't save. Check the fields and that your backend is running.");
    }
  }

  return (
    <section className="bb-form">
      <h2 className="bb-form-title">Consign an artwork</h2>
      <div className="bb-grid">
        <div className="bb-field full">
          <label className="bb-label" htmlFor="f-title">Title</label>
          <input id="f-title" className="bb-input" value={title}
            onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Harbour at First Light" />
        </div>

        <div className="bb-field">
          <label className="bb-label" htmlFor="f-image">Image URL</label>
          <input id="f-image" className="bb-input" value={imageURL}
            onChange={(e) => setImageURL(e.target.value)} placeholder="https://…" />
        </div>

        <div className="bb-field">
          <label className="bb-label" htmlFor="f-price">Starting bid</label>
          <input id="f-price" className="bb-input" type="number" min="0" value={startingPrice}
            onChange={(e) => setStartingPrice(e.target.value)} placeholder="0" />
        </div>

        <div className="bb-field">
          <label className="bb-label" htmlFor="f-start">Bidding starts</label>
          <input id="f-start" className="bb-input" type="datetime-local" value={startTime}
            onChange={(e) => setStartTime(e.target.value)} />
        </div>

        <div className="bb-field">
          <label className="bb-label" htmlFor="f-end">Bidding ends</label>
          <input id="f-end" className="bb-input" type="datetime-local" value={endTime}
            onChange={(e) => setEndTime(e.target.value)} />
        </div>

        <div className="bb-field full">
          <span className="bb-label">Tags</span>
          <div className="bb-chips">
            {TAG_OPTIONS.map((tag) => (
              <button type="button" key={tag} className="bb-chip"
                aria-pressed={tags.includes(tag)} onClick={() => toggleTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bb-form-foot">
        <span className="bb-error">{error}</span>
        <button className="bb-btn" onClick={submit}>List it</button>
      </div>
    </section>
  );
}