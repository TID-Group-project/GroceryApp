import { useId } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { tokens } from "../../theme/tokens";

//   open       true = visible, false = hidden
//   onClose    called when the user presses Esc, clicks outside, or clicks the X
//   title      text in the header
//   children   the content (a TextInput, buttons, ...)
function Modal({ open, onClose, title, children, ...props }) {
  const titleId = useId();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby={titleId}
      {...props}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: tokens.space[4],
        }}
      >
        <Typography id={titleId} variant="h3" component="h2">
          {title}
        </Typography>

        <IconButton aria-label="Close" onClick={onClose} sx={{ mr: -1.5 }}>
          <CloseIcon />
        </IconButton>
      </div>

      {children}
    </Dialog>
  );
}

export default Modal;
