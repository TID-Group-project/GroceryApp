// Home screen. Greets the user, shows all of their lists, and lets them add a new one.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AddIcon from "@mui/icons-material/Add";
import Parse from "../services/backend.js";
import Button from "../components/common/Button.jsx";
import TextInput from "../components/common/TextInput.jsx";
import Modal from "../components/common/Modal.jsx";
import ListCard from "../components/list/ListCard.jsx";
import { loadListsOwner, addList } from "../services/listService.js";

function HomePage() {
  const navigate = useNavigate();

  const [lists, setLists] = useState([]); // Parse List objects
  const [pageError, setPageError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  // The field error appears only after the first "Create" press, not while typing.
  const [submitted, setSubmitted] = useState(false);
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);

  const username = Parse.User.current()?.get("username");

  // Load the lists once, when the page opens.
  useEffect(() => {
    async function load() {
      try {
        setLists(await loadListsOwner());
      } catch {
        setPageError("Could not load your lists. Try again.");
      }
    }
    load();
  }, []);

  // Error for the name field ("" = no error). Shown only after pressing "Create".
  const nameError = name.trim() === "" ? "Enter a name for your list" : "";

  function openModal() {
    event.currentTarget.blur();
    setName("");
    setSubmitted(false);
    setModalError("");
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setSubmitted(true);
    setModalError("");

    if (nameError) return;

    try {
      setSaving(true);
      const newList = await addList(name.trim());
      setLists((current) => [newList, ...current]); // newest list on top
      setModalOpen(false);
    } catch {
      setModalError("Could not create the list. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container>
      <IconButton aria-label="Profile" sx={{ alignSelf: "flex-end" }}>
        <PersonOutlinedIcon />
      </IconButton>

      <Typography variant="h1">Hello {username}</Typography>

      <Button
        variant="outlined"
        fullWidth
        endIcon={<AddIcon />}
        onClick={openModal}
      >
        Add new list
      </Button>

      {pageError && <Alert severity="error">{pageError}</Alert>}

      {!pageError && lists.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          You have no lists yet. Add your first one above.
        </Typography>
      )}

      <Stack spacing={2}>
        {lists.map((list) => (
          <ListCard
            key={list.id}
            name={list.get("name")}
            onClick={() => navigate(`/lists/${list.id}`)}
          />
        ))}
      </Stack>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New list"
      >
        <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
          {modalError && <Alert severity="error">{modalError}</Alert>}
          <TextInput
            label="List name"
            placeholder="Enter list name…"
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={submitted ? nameError : ""}
          />
          <Button type="submit" disabled={saving} fullWidth>
            {saving ? "Creating…" : "Create"}
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}

export default HomePage;
