import { useEffect, useState } from "react";
import Parse from "./services/backend";
import Typography from "@mui/material/Typography";
import Button from "./components/common/Button";
import { tokens } from "./theme/tokens";
import TextInput from "./components/common/TextInput";
import AddIcon from "@mui/icons-material/Add";
import Modal from "./components/common/Modal";

// done to test if the backend is working
function App() {
  // useEffect(() => {
  //   (async () => {
  //     const item = new Parse.Object("Item");
  //     item.set("name", "test milk");
  //     item.set("done", false);
  //     await item.save();
  //     console.log("Saved:", item.id);
  //   })();
  // }, []);
  const [item, setItem] = useState("");
  const [tried, setTried] = useState(false);
  // show the error only after pressing "Add" with an empty field
  const itemError =
    tried && item.trim() === "" ? "Enter a name to add the item" : "";

  // NEW (2): state for the "New list" pop-up
  const [modalOpen, setModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [listTried, setListTried] = useState(false);
  const listError =
    listTried && listName.trim() === "" ? "Enter a name for the list" : "";

  // NEW (3): close and reset the pop-up
  const closeModal = () => {
    setModalOpen(false);
    setListName("");
    setListTried(false);
  };

  // NEW (3): what happens when Create is pressed
  const createList = () => {
    if (listName.trim() === "") {
      setListTried(true); // show the error, keep the pop-up open
      return;
    }
    console.log("Would create list:", listName);
    closeModal();
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h1">Grocery app</Typography>

      {/* 8px between tap targets (NFR5) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.space[2] }}>
        {/* NEW (4): opens the pop-up */}
        <Button onClick={() => setModalOpen(true)}>Create list</Button>
        <Button variant="outlined">Share</Button>
        <Button color="error">Delete list</Button>
        <Button disabled>Disabled</Button>
        <Button variant="outlined" disabled>
          Disabled
        </Button>
      </div>

      {/* TextInput tests */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.space[6],
          maxWidth: 420,
          marginTop: tokens.space[8],
        }}
      >
        {/* 1. Live field: type, press Add with it empty to see the error */}
        <TextInput
          label="Add item"
          placeholder="Type or select an item…"
          value={item}
          onChange={(e) => {
            setItem(e.target.value);
            setTried(false); // clear the error while typing
          }}
          error={itemError}
          endAdornment={<AddIcon color="primary" />}
        />
        <div>
          <Button onClick={() => setTried(true)}>Add</Button>
        </div>

        {/* 2. Always shows the error state, for comparing with Figma */}
        <TextInput
          label="Add item (error)"
          placeholder="Type or select an item…"
          error="Enter a name to add the item"
          endAdornment={<AddIcon color="primary" />}
        />

        {/* 3. Disabled state */}
        <TextInput
          label="List name (disabled)"
          placeholder="Enter list name…"
          disabled
        />
      </div>

      {/* "New list" pop-up from Figma = Modal + TextInput + Buttons */}
      <Modal open={modalOpen} onClose={closeModal} title="New list">
        <TextInput
          label="List name"
          placeholder="Enter list name…"
          autoFocus
          value={listName}
          onChange={(e) => {
            setListName(e.target.value);
            setListTried(false);
          }}
          error={listError}
          endAdornment={<AddIcon color="primary" />}
        />
        <div
          style={{
            display: "flex",
            gap: tokens.space[2],
            marginTop: tokens.space[6],
          }}
        >
          <Button variant="outlined" onClick={closeModal} sx={{ flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={createList} sx={{ flex: 1 }}>
            Create
          </Button>
        </div>
      </Modal>
    </div>
  );
}
export default App;
