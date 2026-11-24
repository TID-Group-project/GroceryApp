// Field to add an item to a list. Same pattern as the "New list" pop-up.
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import TextInput from "../common/TextInput";

function ItemInput({ onAdd }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (name.trim() === "") {
      setError("Enter a name to add the item");
      return;
    }
    onAdd(name.trim());
    setName("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextInput
        label="Add item"
        // change to "Type or select an item…" when the recent-items list exists
        placeholder="Type an item…"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={error}
        endAdornment={
          <IconButton type="submit" aria-label="Add item">
            <AddIcon color="primary" />
          </IconButton>
        }
      />
    </form>
  );
}

export default ItemInput;
