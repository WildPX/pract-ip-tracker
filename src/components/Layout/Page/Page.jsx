import toast, { Toaster } from "react-hot-toast";
import Header from "../../Elements/Header/Header";
import Map from "../../Elements/Map/Map";
import classes from "./Page.module.css";
import { useAddress } from "../../../context/AddressContext";
import { useEffect } from "react";

function Page() {
  const { error, clearError } = useAddress();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    clearError();
  }, [error, clearError]);

  return (
    <div className={classes.pageContainer}>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <Map />
    </div>
  );
}
export default Page;
