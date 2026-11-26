// Login screen. One main "Log in" button and a small "Register" link:
// in our usability test, two buttons of the same size confused 2 of 4 participants.
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import { login } from "../services/authService";

const initialState = { username: "", password: "" };

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  // Field errors appear only after the first "Log in" press, not while typing.
  const [submitted, setSubmitted] = useState(false);
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);


// Error for each field ("" = no error). Shown only after pressing "Log in".
  const errors = {
    username: form.username.trim() === "" ? "Enter your username" : "",
    password: form.password === "" ? "Enter your password" : "",
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
      await login(form.username, form.password);
      navigate("/"); // go to the home screen
    } catch (error) {
      setPageError(error.message); // e.g. "Wrong username or password."
    } finally {
      setSaving(false);
    }
  }

    return (
    <Container>
      <Typography variant="h1">Log in</Typography>

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
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          error={submitted ? errors.password : ""}
        />
        <Button type="submit" disabled={saving} fullWidth>
          {saving ? "Logging in…" : "Log in"}
        </Button>
      </Stack>

      <Typography variant="body1" sx={{ textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link component={RouterLink} to="/register">
          Register
        </Link>
      </Typography>
    </Container>
  );
}

export default LoginPage;