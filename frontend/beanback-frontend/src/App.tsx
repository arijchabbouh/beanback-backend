import { useState, useEffect } from "react";
import type { Artwork, NewArtwork, Tag } from "./types";
import { DEMO_ARTWORKS } from "./data";
import { getArtworks, createArtwork, deleteArtwork, subscribeArtwork } from "./api";
import { useAuth } from "./useAuth";
import AuthScreen from "./components/AuthScreen";
import ArtworkForm from "./components/ArtworkForm";
import Filters from "./components/Filters";
import ArtworkCard from "./components/ArtworkCard";
import "./index.css";

export default function App() {
  const { token, user, login, register, logout } = useAuth();

  const [artworks, setArtworks] = useState<Artwork[]>(DEMO_ARTWORKS);
  const [filterTag, setFilterTag] = useState<Tag | "all">("all");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    getArtworks()
      .then(setArtworks)
      .catch(() => console.error("Couldn't reach the backend — showing sample pieces."));
  }, []);

  if (!token || !user) {
    return (
      <div className="bb-root">
        <div className="bb-wrap">
          <AuthScreen onLogin={login} onRegister={register} />
        </div>
      </div>
    );
  }

  // From here down, `user` and `token` are guaranteed.
  async function handleAdd(input: NewArtwork) {
    const saved = await createArtwork(input, token!);
    setArtworks((prev) => [saved, ...prev]);
  }

  async function handleDelete(id: string) {
    try {
      await deleteArtwork(id, token!);
      setArtworks((prev) => prev.filter((a) => a._id !== id));
    } catch {
      console.error("Couldn't delete — it may not be yours.");
    }
  }

  async function handleSubscribe(id: string) {
    await subscribeArtwork(id, token!);
  }

  // Apply the filters first…
  const visible = artworks.filter((art) => {
    const tagOk = filterTag === "all" || art.tags.includes(filterTag);
    const priceOk = maxPrice === "" || art.startingPrice <= Number(maxPrice);
    return tagOk && priceOk;
  });

  // …then split what's left into mine vs everyone else's.
  const mineList = visible.filter((art) => art.ownerId === user.id);
  const communityList = visible.filter((art) => art.ownerId !== user.id);
  const filtersActive = filterTag !== "all" || maxPrice !== "";

  // One helper so we don't write the wall markup twice.
  function renderWall(title: string, list: Artwork[], emptyMsg: string) {
    return (
      <section>
        <div className="bb-wall-head">
          <h2 className="bb-wall-title">{title}</h2>
          <span className="bb-count">
            {list.length} {list.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        {list.length === 0 ? (
          <div className="bb-empty">{emptyMsg}</div>
        ) : (
          <div className="bb-gallery">
            {list.map((art) => (
              <ArtworkCard
                key={art._id}
                art={art}
                mine={art.ownerId === user.id}
                onDelete={handleDelete}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="bb-root">
      <div className="bb-wrap">
        <header className="bb-head">
          <div className="bb-brand">Art<span>Walls</span></div>
          <div className="bb-user">
            <div className="bb-user-meta">
              <div className="bb-user-name">{user.name}</div>
              <div className="bb-wallet">{user.wallet} coins</div>
            </div>
            <button className="bb-logout" onClick={logout}>Log out</button>
          </div>
        </header>

        <ArtworkForm onAdd={handleAdd} />

        <Filters
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        {renderWall(
          "My wall",
          mineList,
          filtersActive ? "None of your pieces match these filters." : "You haven't consigned anything yet."
        )}

        {renderWall(
          "Community wall",
          communityList,
          filtersActive ? "No community pieces match these filters." : "Nothing from other artists yet."
        )}
      </div>
    </div>
  );
}