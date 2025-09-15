import Header from "../../Elements/Header/Header";
import Map from "../../Elements/Map/Map";
import classes from "./Page.module.css";

function Page() {
  return (
    <div className={classes.pageContainer}>
      <Header />
      <Map />
    </div>
  );
}
export default Page;
