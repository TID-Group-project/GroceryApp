// Home screen. Greets the user, shows all of their lists (own and shared with them),
// and lets them add, rename, delete or leave a list.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AddIcon from "@mui/icons-material/Add";
import Parse from "../services/backend.js";
import Button from "../components/common/Button.jsx";
import TextInput from "../components/common/TextInput.jsx";
import Modal from "../components/common/Modal.jsx";
import ListCard from "../components/list/ListCard.jsx";
import ListMenu from "../components/list/ListMenu.jsx";
import {
  loadAllUserLists,
  addList,
  renameList,
  deleteList,
} from "../services/listService.js";
import { leaveList } from "../services/memberService.js";

function HomePage() {
  const navigate = useNavigate();

  const [lists, setLists] = useState([]); // plain objects from loadAllUserLists
  const [pageError, setPageError] = useState("");

  // These fields are shared by the "New list" and "Rename" pop-ups:
  // only one pop-up is open at a time.
  const [modalOpen, setModalOpen] = useState(false); // "New list"
  const [name, setName] = useState("");
  // The field error appears only after the first button press, not while typing.
  const [submitted, setSubmitted] = useState(false);
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);

  // The "⋯" menu: the button it hangs on, and the list it belongs to.
  // The list is kept when the menu closes, so the menu does not change while it fades out.
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuList, setMenuList] = useState(null);

  // The pop-up for Rename / Delete / Leave. `action` stays after closing, for the same reason.
  const [action, setAction] = useState(null); // { type: "rename" | "delete" | "leave", list }
  const [actionOpen, setActionOpen] = useState(false);

  const username = Parse.User.current()?.get("username");

  const MAX_LIST_NAME_LENGTH = 30;

  // Load the lists once, when the page opens.
  useEffect(() => {
    async function load() {
      try {
        setLists(await loadAllUserLists());
      } catch {
        setPageError("Could not load your lists. Try again.");
      }
    }
    load();
  }, []);

  // Error for the name field ("" = no error). Shown only after pressing the button.
  const nameError =
    name.trim() === ""
      ? "Enter a name for your list"
      : name.trim().length > MAX_LIST_NAME_LENGTH
        ? `Use at most ${MAX_LIST_NAME_LENGTH} characters`
        : "";

  // creates a new list and adds it to the top of the list array. Closes the pop-up.
  function openModal(event) {
    event.currentTarget.blur();
    setName("");
    setSubmitted(false);
    setModalError("");
    setModalOpen(true);
  }

  //handles the creation of a new list, and checks that the name is valid ( not empty or to long)
  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setSubmitted(true);
    setModalError("");

    if (nameError) return;

    try {
      setSaving(true);
      const newList = await addList(name.trim());
      setLists((current) => [
        {
          id: newList.id,
          name: newList.get("name"),
          isShared: false,
          isOwner: true,
          memberCount: 0,
          memberRecordId: null,
        },
        ...current,
      ]); // newest list on top
      setModalOpen(false);
    } catch {
      setModalError("Could not create the list. Try again.");
    } finally {
      setSaving(false);
    }
  }

  // shows the "⋯" menu for a list.
  function openMenu(event, list) {
    setMenuAnchor(event.currentTarget);
    setMenuList(list);
  }

  // The user chose Rename, Delete or Leave: close the menu and open the pop-up.
  function startAction(type) {
    setMenuAnchor(null);
    setName(menuList.name); // only used by Rename
    setSubmitted(false);
    setModalError("");
    setAction({ type, list: menuList });
    setActionOpen(true);
  }

  // handels the renaming of a list, and checks that the name is valid ( not empty or to long)
  async function handleRename(event) {
    event.preventDefault();
    setSubmitted(true);
    setModalError("");

    if (nameError) return;

    const newName = name.trim();
    try {
      setSaving(true);
      await renameList(action.list.id, newName);
      setLists((current) =>
        current.map((list) =>
          list.id === action.list.id ? { ...list, name: newName } : list,
        ),
      );
      setActionOpen(false);
    } catch {
      setModalError("Could not rename the list. Try again.");
    } finally {
      setSaving(false);
    }
  }

  // shows the confirmation pop-up for Delete or Leave, and handles the action if confirmed. Closes the pop-up.
  async function handleConfirm() {
    const { type, list } = action;
    setModalError("");

    try {
      setSaving(true);
      if (type === "delete") {
        await deleteList(list.id);
      } else {
        await leaveList(list.id, list.memberRecordId);
      }
      setLists((current) => current.filter((item) => item.id !== list.id));
      setActionOpen(false);
    } catch {
      setModalError(
        type === "delete"
          ? "Could not delete the list. Try again."
          : "Could not leave the list. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Texts for the Delete / Leave pop-up
  const target = action?.list;
  const isDelete = action?.type === "delete";
  const people = target?.memberCount ?? 0;
  const confirmText = isDelete
    ? people > 0
      ? `This list is shared with ${people} ${people === 1 ? "person" : "people"}. Deleting it removes it and its items for everyone.`
      : "Deleting it removes the list and its items. This can't be undone."
    : "You won't see or edit this list anymore. The other members keep it.";

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

      <List>
        {lists.map((list) => (
          <ListCard
            key={list.id}
            name={list.name}
            isShared={list.isShared}
            onClick={() => navigate(`/lists/${list.id}`)}
            onOpenMenu={(event) => openMenu(event, list)}
          />
        ))}
      </List>

      <ListMenu
        anchorEl={menuAnchor}
        isOwner={menuList?.isOwner}
        onClose={() => setMenuAnchor(null)}
        onRename={() => startAction("rename")}
        onDelete={() => startAction("delete")}
        onLeave={() => startAction("leave")}
      />

      {/* New list */}
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
            slotProps={{ input: { maxLength: MAX_LIST_NAME_LENGTH } }}
            error={submitted ? nameError : ""}
          />
          <Button type="submit" disabled={saving} fullWidth>
            {saving ? "Creating…" : "Create"}
          </Button>
        </Stack>
      </Modal>

      {/* Rename */}
      <Modal
        open={actionOpen && action?.type === "rename"}
        onClose={() => setActionOpen(false)}
        title="Rename list"
      >
        <Stack component="form" spacing={2} onSubmit={handleRename} noValidate>
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
            {saving ? "Saving…" : "Save"}
          </Button>
        </Stack>
      </Modal>

      {/* Delete (owner) or Leave (member) */}
      <Modal
        open={actionOpen && action?.type !== "rename"}
        onClose={() => setActionOpen(false)}
        title={`${isDelete ? "Delete" : "Leave"} “${target?.name ?? ""}”?`}
      >
        <Stack spacing={2}>
          {modalError && <Alert severity="error">{modalError}</Alert>}
          <Typography variant="body1">{confirmText}</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              disabled={saving}
              onClick={() => setActionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color={isDelete ? "error" : "primary"}
              fullWidth
              disabled={saving}
              onClick={handleConfirm}
            >
              {saving
                ? isDelete
                  ? "Deleting…"
                  : "Leaving…"
                : isDelete
                  ? "Delete"
                  : "Leave"}
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </Container>
  );
}

export default HomePage;
