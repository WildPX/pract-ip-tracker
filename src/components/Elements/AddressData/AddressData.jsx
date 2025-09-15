import { useAddress } from "../../../context/AddressContext";
import DataItem from "../DataItem/DataItem";

function AddressData() {
  const { data } = useAddress();

  const items = [
    {
      title: "IP Address",
      text: data?.ip,
    },
    {
      title: "Location",
      text: `${data?.location.city}, ${data?.location.country}`,
    },
    {
      title: "Timezone",
      text: `UTC ${data?.location.timezone}`,
    },
    {
      title: "ISP",
      text: data?.isp,
    },
  ];

  return (
    <section>
      <ul>
        {items.map((item, index) => (
          <DataItem key={index} title={item.title} text={item.text} />
        ))}
      </ul>
    </section>
  );
}
export default AddressData;
