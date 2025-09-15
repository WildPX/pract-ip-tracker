import AddressData from "../AddressData/AddressData";
import Search from "../Search/Search";

function Header() {
  return (
    <header>
      <h1>IP Address Tracker</h1>
      <Search />
      <AddressData />
    </header>
  );
}
export default Header;
