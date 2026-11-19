// Register screen. Same layout as the login screen, so users recognise it:
// one main "Create account" button and a small "Log in" link.
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import { register } from "../services/authService";

const initialState = { username: "", password: "" };

// Short passwords are easy to guess; 6 is also the minimum we tell users.
const MIN_PASSWORD_LENGTH = 6;

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  // Field errors appear only after the first "Create account" press, not while typing.
  const [submitted, setSubmitted] = useState(false);
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);

  // Error for each field ("" = no error). Shown only after pressing "Create account".
  const errors = {
    username: form.username.trim() === "" ? "Enter a username" : "",
    password:
      form.password.length < MIN_PASSWORD_LENGTH
        ? "Use at least 6 characters"
        : "",
  };
  const canSubmit = !errors.username && !errors.password;

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setSubmitted(true);
    setPageError("");

    if (!canSubmit) return;

    try {
      setSaving(true);
      // register() also logs the user in, so we can go straight home.
      await register(form.username, form.password);
      navigate("/");
    } catch (error) {
      setPageError(error.message); // e.g. "This username is already taken."
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container>
      <Typography variant="h1">Create account</Typography>

      {pageError && <Alert severity="error">{pageError}</Alert>}

      <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
        <TextInput
          label="Username"
          autoComplete="username"
          value={form.username}
          onChange={(event) => updateField("username", event.target.value)}
          error={submitted ? errors.username : ""}
        />
        <TextInput
          label="Password"
          type="password"
          // Lets password managers suggest a new strong password.
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          error={submitted ? errors.password : ""}
        />
        <Button type="submit" disabled={saving} fullWidth>
          {saving ? "Creating account…" : "Create account"}
        </Button>
      </Stack>

      <Typography variant="body1" sx={{ textAlign: "center" }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login">
          Log in
        </Link>
      </Typography>
    </Container>
  );
}

export default RegisterPage;
