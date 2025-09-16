import { useAddress } from "../../../context/AddressContext";
import DataItem from "../DataItem/DataItem";
import classes from "./AddressData.module.css";

function AddressData() {
  const { data } = useAddress();

  const items = [
    {
      title: "IP Address",
      text: data?.ip && data.ip.trim() !== "" ? data.ip : "—",
    },
    {
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
      title: "Timezone",
      text:
        data?.location?.timezone && data.location.timezone.trim() !== ""
          ? `UTC ${data.location.timezone}`
          : "—",
    },
    {
      title: "ISP",
      text: data?.isp && data.isp.trim() !== "" ? data.isp : "—",
    },
  ];

  return (
    <section className={classes.addressDataContainer}>
      <ul className={classes.addressDataList}>
        {items.map((item, index) => (
          <DataItem key={index} title={item.title} text={item.text} />
        ))}
      </ul>
    </section>
  );
}
export default AddressData;
