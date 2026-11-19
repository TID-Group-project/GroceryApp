import { useId } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

//   label          text shown above the field (always visible)
//   error          error message. Leave empty for no error.
//   endAdornment   optional icon or button at the right end of the field (like the + icon)
function TextInput({ label, error = "", endAdornment, id, ...props }) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div>
      <Typography
        variant="caption"
        component="label"
        htmlFor={inputId} // connects the label to the field, so clicking the label focuses it
        sx={{ display: "block", mb: 1 }} // styles: 8 px gap between label and field (mb = margin-bottom)
      >
        {label}
      </Typography>

      <TextField
        id={inputId}
        fullWidth
        error={Boolean(error)}
        helperText={
          error ? (
            <>
              <ErrorOutlinedIcon sx={{ fontSize: 16 }} aria-hidden="true" />
              <span role="alert">{error}</span>
            </>
          ) : undefined
        }
        slotProps={{ input: { endAdornment } }}
        {...props}
      />
    </div>
  );
}

export default TextInput;
