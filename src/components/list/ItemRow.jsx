import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

function ItemRow({ name, done = false, onToggle, onDelete }) {
  return (
    <ListItem
      secondaryAction={
        <IconButton aria-label={`Delete ${name}`} onClick={onDelete}>
          <DeleteOutlinedIcon />
        </IconButton>
      }
    >
      <Checkbox
        edge="start"
        checked={done}
        onChange={(e) => onToggle(e.target.checked)}
        slotProps={{ input: { "aria-label": `Mark ${name} as bought` } }}
      />
      <ListItemText
        primary={name}
        sx={{ textDecoration: done ? "line-through" : "none" }}
        slotProps={{ primary: { variant: "h4", noWrap: true } }}
      />
    </ListItem>
  );
}

export default ItemRow;
