import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

//   anchorEl   the "⋯" button the menu hangs on (null = menu closed)
//   isOwner    true: Rename + Delete list. false: Rename + Leave list.
//   onClose    called when the user presses Esc or clicks outside
function ListMenu({ anchorEl, isOwner, onClose, onRename, onDelete, onLeave }) {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={onRename}>
        <ListItemIcon>
          <EditOutlinedIcon />
        </ListItemIcon>
        <ListItemText>Rename</ListItemText>
      </MenuItem>

      {isOwner ? (
        <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Delete list</ListItemText>
        </MenuItem>
      ) : (
        <MenuItem onClick={onLeave}>
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Leave list</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}

export default ListMenu;
