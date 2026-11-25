import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";

function ListCard({ name, isShared = false, onClick }) {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemText
        primary={name}
        slotProps={{ primary: { variant: "h4", noWrap: true } }}
      />
      {isShared && <Chip label="Shared" />}
    </ListItemButton>
  );
}

export default ListCard;
