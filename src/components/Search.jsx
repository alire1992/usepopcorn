import { useRef } from "react";
import { useKey } from "../hooks/useKey";

const Search = ({ query, setQuery }) => {
  const elRef = useRef(null);
  useKey("enter", () => {
    if (document.activeElement === elRef.current) return;
    elRef.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={elRef}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

export default Search;
