import { useState } from "react";
import type { Artwork } from "../types";

interface Props {
  art: Artwork;
  mine: boolean;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    input: {
      title: string;
      imageURL: string;
      startingPrice: number;
    }
  ) => Promise<void>;
  onSubscribe: (id: string) => Promise<void>;
}

export default function ArtworkCard({
  art,
  mine,
  onDelete,
  onUpdate,
  onSubscribe,
}: Props) {
  const [subscribed, setSubscribed] = useState(false);
  const status = art.status ?? "scheduled";
const [editing, setEditing] = useState(false);

const [title, setTitle] = useState(art.title);
const [imageURL, setImageURL] = useState(art.imageURL);
const [startingPrice, setStartingPrice] = useState(
  art.startingPrice.toString()
);
  async function subscribe() {
    try {
      await onSubscribe(art._id);
      setSubscribed(true);
    } catch { console.error("Couldn't subscribe — you may have already done so."); }
  }

  return (
    <article className="bb-card">
     <div className="bb-frame">
  <img src={art.imageURL} alt={art.title} />
  <span className={`bb-badge bb-badge--${status}`}>{status}</span>

  {mine && (
    <div className="bb-actions">
      <button
        className="bb-remove"
        onClick={() => onDelete(art._id)}
        aria-label={`Remove ${art.title}`}
      >
        Remove
      </button>

      <button
        className="bb-update"
        onClick={() => setEditing(!editing)}
        aria-label={`Update ${art.title}`}
      >
        {editing ? "Cancel" : "Update"}
      </button>
    </div>
  )}
</div>
      <div className="bb-plate">
        <h3 className="bb-piece-title">{art.title}</h3>
        {art.tags.length > 0 && (
          <div className="bb-piece-tags">
            {art.tags.map((t) => <span className="bb-mini" key={t}>{t}</span>)}
          </div>
        )}
        <div className="bb-price">
          <span>Starting bid</span> <b>${Number(art.startingPrice).toLocaleString()}</b>
              </div>
              {editing && (
  <div style={{ marginTop: "12px" }}>
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Title"
    />

    <input
      value={imageURL}
      onChange={(e) => setImageURL(e.target.value)}
      placeholder="Image URL"
    />

    <input
      type="number"
      value={startingPrice}
      onChange={(e) => setStartingPrice(e.target.value)}
      placeholder="Starting price"
    />

    <button
      onClick={async () => {
        await onUpdate(art._id, {
          title,
          imageURL,
          startingPrice: Number(startingPrice),
        });

        setEditing(false);
      }}
    >
      Save
    </button>
  </div>
)}

        {}
        {status === "scheduled" && !mine && (
          <button className="bb-subscribe" onClick={subscribe} disabled={subscribed}>
            {subscribed ? "You'll be notified ✓" : "Notify me when it opens"}
          </button>
        )}
      </div>
    </article>
  );
}