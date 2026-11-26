// List screen. Shows the items of one list, and lets the user add and delete them.
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Stack from "@mui/material/Stack";
import { loadList } from "../services/listService";
import {
  loadItems,
  addItem,
  deleteItem,
  setDone,
} from "../services/itemService";
import ItemInput from "../components/list/ItemInput";
import ItemRow from "../components/list/ItemRow";

function ListPage() {
  const navigate = useNavigate();
  const { listId } = useParams(); // from the address: /lists/:listId

  const [list, setList] = useState(null); // Parse List object
  const [items, setItems] = useState([]); // plain objects from itemService
  const [error, setError] = useState("");

  // Load the list and its items when the page opens (or the list changes)
  useEffect(() => {
    async function load() {
      try {
        const loadedList = await loadList(listId);
        setList(loadedList);
        setItems(await loadItems(loadedList));
      } catch {
        // no such list, or its ACL does not let me read it
        setError("Could not load this list. Try again.");
      }
    }
    load();
  }, [listId]);

  async function handleAdd(name) {
    setError("");
    try {
      const item = await addItem(list, name);
      setItems((current) => [...current, item]); // newest item at the bottom
    } catch {
      setError("Could not add the item. Try again.");
    }
  }

  async function handleDelete(id) {
    setError("");
    const previousItems = items;
    setItems((current) => current.filter((item) => item.id !== id));
    try {
      await deleteItem(id);
    } catch {
      setItems(previousItems);
      setError("Could not delete the item. Try again.");
    }
  }

  async function handleToggle(id, done) {
    setError("");
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, done } : item)),
    );

    try {
      await setDone(id, done);
    } catch {
      // saving failed: put the item back as it was
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, done: !done } : item,
        ),
      );
      setError("Could not update the item. Try again.");
    }
  }

  if (!list) {
    return (
      <Container>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography variant="body1">Loading…</Typography>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="row" sx={{ justifyContent: "flex-end", gap: 1 }}>
        <IconButton
          aria-label="Share list"
          onClick={() => navigate(`/lists/${listId}/share`)}
        >
          <PersonAddOutlinedIcon />
        </IconButton>
        <IconButton aria-label="Close list" onClick={() => navigate("/home")}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Typography variant="h2">{list.get("name")}</Typography>

      {<ItemInput onAdd={handleAdd} />}

      {error && <Alert severity="error">{error}</Alert>}

      {items.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No items yet. Add your first one above.
        </Typography>
      )}

      <List>
        {items.map((item) => (
          <ItemRow
            key={item.id}
            name={item.name}
            done={item.done}
            onToggle={(done) => handleToggle(item.id, done)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </List>
    </Container>
  );
}

export default ListPage;
