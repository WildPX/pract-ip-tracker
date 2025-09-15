import { useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { useAddress } from "../../../context/AddressContext";

function Search() {
  const [query, setQuery] = useState("");
  const { data, fetchData } = useAddress();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchData(query);
    // console.log(data);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter IP Address"
      />
      <button type="submit">
        <FaGreaterThan />
      </button>
    </form>
  );
}
export default Search;
