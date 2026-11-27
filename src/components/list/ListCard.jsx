import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

//   name         the list name
//   isShared     true = show the "Shared" tag
//   onClick      open the list
//   onOpenMenu   open the "⋯" menu (Rename / Delete / Leave)
// The "⋯" button sits next to the card button, not inside it:
function ListCard({ name, isShared = false, onClick, onOpenMenu }) {
  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton
          aria-label={`Options for ${name}`}
          aria-haspopup="menu"
          onClick={onOpenMenu}
        >
          <MoreHorizIcon />
        </IconButton>
      }
    >
      <ListItemButton onClick={onClick}>
        <ListItemText
          primary={name}
          sx={{ flex: "0 1 auto" }}
          slotProps={{ primary: { variant: "h4", noWrap: true } }}
        />
        {isShared && <Chip label="Shared" icon={<PeopleOutlinedIcon />} />}
      </ListItemButton>
    </ListItem>
  );
}

export default ListCard;
