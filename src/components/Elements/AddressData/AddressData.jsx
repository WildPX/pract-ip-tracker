import { Fragment } from "react";
import { useAddress } from "../../../context/AddressContext";
import DataItem from "../DataItem/DataItem";
import classes from "./AddressData.module.css";

function AddressData() {
  const { data } = useAddress();

  const items = [
    {
      key: "ip-address",
      title: "IP Address",
      text: data?.ip && data.ip.trim() !== "" ? data.ip : "—",
    },
    {
      key: "location",
      title: "Location",
      text:
        data?.location &&
        (data.location.city?.trim() || data.location.country?.trim())
          ? `${data.location.city?.trim() || "—"}, ${
              data.location.country?.trim() || "—"
            }`
          : "—",
    },
    {
      key: "timezone",
      title: "Timezone",
      text:
        data?.location?.timezone && data.location.timezone.trim() !== ""
          ? `UTC ${data.location.timezone}`
          : "—",
    },
    {
      key: "isp",
      title: "ISP",
      text: data?.isp && data.isp.trim() !== "" ? data.isp : "—",
    },
  ];

  return (
    <section className={classes.addressDataContainer}>
      <ul className={classes.addressDataList}>
        {items.map((item, index) => (
          <Fragment key={item.key}>
            <DataItem title={item.title} text={item.text} />
            {index < items.length - 1 && <li className={classes.divider} />}
          </Fragment>
        ))}
      </ul>
    </section>
  );
}
export default AddressData;
