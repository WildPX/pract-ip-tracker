import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useAddress } from "../../../context/AddressContext";
import classes from "./Search.module.css";

function Search() {
  const [query, setQuery] = useState("");
  const { loading, fetchData, setError } = useAddress();

  function isValidQuery(ip) {
    if (ip === "") return true;
    return /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/.test(
      ip
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidQuery(query)) {
      setError("Invalid IP!");
      return;
    }

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
      <button type="submit" disabled={loading}>
        <FaChevronRight />
      </button>
    </form>
  );
}
export default Search;
