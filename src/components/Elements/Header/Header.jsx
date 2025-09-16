import AddressData from "../AddressData/AddressData";
import Search from "../Search/Search";
import classes from "./Header.module.css";

function Header() {
  return (
    <header className={classes.header}>
      <h1>IP Address Tracker</h1>
      <Search />
      <AddressData />
    </header>
  );
}
export default Header;
