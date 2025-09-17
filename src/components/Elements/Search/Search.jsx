import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useAddress } from "../../../context/AddressContext";
import classes from "./Search.module.css";

function Search() {
  const [query, setQuery] = useState("");
  const { fetchData } = useAddress();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchData(query);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={classes.searchForm}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter IP Address"
        type="text"
      />
      <button type="submit">
        <FaChevronRight />
      </button>
    </form>
  );
}
export default Search;
