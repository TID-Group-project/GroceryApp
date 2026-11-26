/* Developing code: Ivana Andrade */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import SearchIcon from "@mui/icons-material/Search";

import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import { getCurrentUser } from "../services/authService";
import {
  getListDetails,
  getListMembers,
  getAvailableUsers,
  addMembersToList,
  removeMemberFromList,
  removeAllOtherMembers,
} from "../services/memberService";

export default function SharePage({ listId: propListId }) {
  const { listId: paramListId } = useParams();
  const navigate = useNavigate();
  const activeListId = propListId || paramListId;
  const currentUser = getCurrentUser();

  const [listName, setListName] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add People (Search & Select) Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Remove Member Confirmation Modal State
  const [memberToRemove, setMemberToRemove] = useState(null);

  // Owner Status & Remove All Confirmation Modal State
  const [ownerId, setOwnerId] = useState(null);
  const [confirmRemoveAllOpen, setConfirmRemoveAllOpen] = useState(false);

  async function loadPageData() {
    try {
      setLoading(true);
      setError("");
      const [details, memberList] = await Promise.all([
        getListDetails(activeListId),
        getListMembers(activeListId),
      ]);
      setListName(details.name);
      setOwnerId(details.ownerId);
      setMembers(memberList);
    } catch (err) {
      setError(err.message || "Could not load list members.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, [activeListId]);

  // Open Search Modal and fetch users not already on the list
  async function handleOpenAddModal() {
    try {
      setError("");
      setSearchQuery("");
      setSelectedUsers([]);
      const existingIds = members.map((m) => m.userId);
      if (currentUser?.id && !existingIds.includes(currentUser.id)) {
        existingIds.push(currentUser.id);
      }
      const users = await getAvailableUsers(existingIds);
      setAvailableUsers(users);
      setAddModalOpen(true);
    } catch (err) {
      setError(err.message || "Could not load users.");
    }
  }

  function handleToggleUser(user) {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      return exists ? prev.filter((u) => u.id !== user.id) : [...prev, user];
    });
  }

  async function handleConfirmShare() {
    if (selectedUsers.length === 0) return;
    try {
      setSubmitting(true);
      await addMembersToList(activeListId, selectedUsers);
      setAddModalOpen(false);
      await loadPageData();
    } catch (err) {
      setError(err.message || "Could not share list.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmRemove() {
    if (!memberToRemove) return;
    try {
      setSubmitting(true);
      await removeMemberFromList(
        activeListId,
        memberToRemove.memberRecordId,
        memberToRemove.userId,
      );
      setMembers((prev) =>
        prev.filter((m) => m.userId !== memberToRemove.userId),
      );
      setMemberToRemove(null);
    } catch (err) {
      setError(err.message || "Could not remove member.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmRemoveAll() {
    try {
      setSubmitting(true);
      await removeAllOtherMembers(activeListId);
      setMembers((prev) => prev.filter((m) => m.userId === ownerId));
      setConfirmRemoveAllOpen(false);
    } catch (err) {
      setError(err.message || "Could not remove members.");
    } finally {
      setSubmitting(false);
    }
  }

  const isOwner = Boolean(currentUser?.id && currentUser.id === ownerId);
  const hasOtherMembers = members.some((m) => m.userId !== ownerId);

  const filteredUsers = availableUsers.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Container>
      {/* Top Navigation: Back to List & Close to Home */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <IconButton
          aria-label="Back to list"
          onClick={() => navigate(`/lists/${activeListId}`)}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton aria-label="Close to home" onClick={() => navigate("/")}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Typography variant="h2">List Members ({members.length})</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Add People Button */}
      <Button
        variant="outlined"
        fullWidth
        startIcon={<PersonAddOutlinedIcon />}
        onClick={handleOpenAddModal}
      >
        Add people
      </Button>

      {/* Current Members List */}
      <List>
        {loading ? (
          <ListItem>
            <ListItemText primary="Loading members..." />
          </ListItem>
        ) : (
          members.map((member) => {
            const isYou = currentUser?.id === member.userId;
            return (
              <ListItem
                key={member.userId}
                secondaryAction={
                  isOwner &&
                  !isYou && (
                    <IconButton
                      edge="end"
                      aria-label={`Remove ${member.username}`}
                      onClick={() => setMemberToRemove(member)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemIcon>
                  <PersonOutlineIcon />
                </ListItemIcon>
                <ListItemText
                  primary={isYou ? "You" : member.username}
                  primaryTypographyProps={{ variant: "h4" }}
                />
              </ListItem>
            );
          })
        )}
      </List>

      {/* Bottom Action: Remove all other members (owner only) */}
      {isOwner && (
        <Button
          variant="outlined"
          color="error"
          fullWidth
          disabled={submitting || !hasOtherMembers}
          onClick={() => setConfirmRemoveAllOpen(true)}
        >
          Remove all members
        </Button>
      )}

      {/* MODAL 1: Search & Select Users */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton aria-label="Back" onClick={() => setAddModalOpen(false)}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton aria-label="Close" onClick={() => setAddModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {filteredUsers.length === 0 ? (
            <ListItem>
              <ListItemText primary="No users found" />
            </ListItem>
          ) : (
            filteredUsers.map((user) => {
              const checked = selectedUsers.some((u) => u.id === user.id);
              return (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton
                    selected={checked}
                    onClick={() => handleToggleUser(user)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemIcon>
                      <PersonOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.username}
                      primaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })
          )}
        </List>

        <Button
          variant="contained"
          fullWidth
          disabled={selectedUsers.length === 0 || submitting}
          onClick={handleConfirmShare}
        >
          {submitting ? "Sharing..." : "Share"}
        </Button>
      </Dialog>

      {/* MODAL 2: Remove Member Confirmation */}
      <Dialog
        open={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        fullWidth
        maxWidth="xs"
      >
        <Typography variant="h3">Remove {memberToRemove?.username}?</Typography>
        <Typography variant="body1">
          {memberToRemove?.username} won&apos;t see or edit &quot;{listName}
          &quot;.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            disabled={submitting}
            onClick={() => setMemberToRemove(null)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={submitting}
            onClick={handleConfirmRemove}
          >
            {submitting ? "Removing..." : "Remove"}
          </Button>
        </Stack>
      </Dialog>

      {/* MODAL 3: Remove All Other Members Confirmation */}
      <Dialog
        open={confirmRemoveAllOpen}
        onClose={() => setConfirmRemoveAllOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <Typography variant="h3">Remove everyone else?</Typography>
        <Typography variant="body1">
          All other members won&apos;t see or edit &quot;{listName}&quot;. You
          will remain the owner.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            disabled={submitting}
            onClick={() => setConfirmRemoveAllOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={submitting}
            onClick={handleConfirmRemoveAll}
          >
            {submitting ? "Removing..." : "Remove all"}
          </Button>
        </Stack>
      </Dialog>
    </Container>
  );
}
