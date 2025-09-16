import classes from "./DataItem.module.css";

function DataItem({ title, text }) {
  return (
    <li className={classes.dataItem}>
      <h2>{title}</h2>
      <p>{text}</p>
    </li>
  );
}
export default DataItem;
