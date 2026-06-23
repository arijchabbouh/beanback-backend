import type { Tag } from "../types";
import { TAG_OPTIONS } from "../data";


interface Props {
  filterTag: Tag | "all";
  setFilterTag: (tag: Tag | "all") => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
}

export default function Filters({ filterTag, setFilterTag, maxPrice, setMaxPrice }: Props) {
  const filtersActive = filterTag !== "all" || maxPrice !== "";

  return (
    <div className="bb-filters">
      <div className="bb-filter-group">
        <span className="bb-filter-label">Tag</span>
        <div className="bb-chips">
          <button type="button" className="bb-chip"
            aria-pressed={filterTag === "all"} onClick={() => setFilterTag("all")}>
            all
          </button>
          {TAG_OPTIONS.map((tag) => (
            <button type="button" key={tag} className="bb-chip"
              aria-pressed={filterTag === tag} onClick={() => setFilterTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="bb-filter-group">
        <span className="bb-filter-label">Max price</span>
        <input className="bb-input bb-price-input" type="number" min="0" placeholder="any"
          value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>

      {filtersActive && (
        <button className="bb-clear"
          onClick={() => { setFilterTag("all"); setMaxPrice(""); }}>
          Clear filters
        </button>
      )}
    </div>
  );
}