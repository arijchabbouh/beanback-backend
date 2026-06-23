import { useState } from "react";
import type { Artwork } from "../types";

interface Props {
  art: Artwork;
  mine: boolean;                         
  onDelete: (id: string) => void;
  onSubscribe: (id: string) => Promise<void>;
}

export default function ArtworkCard({ art, mine, onDelete, onSubscribe }: Props) {
  const [subscribed, setSubscribed] = useState(false);
  const status = art.status ?? "scheduled";

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

        {}
        {mine && (
          <button className="bb-remove" onClick={() => onDelete(art._id)}
            aria-label={`Remove ${art.title}`}>
            Remove
                  </button>
                  
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