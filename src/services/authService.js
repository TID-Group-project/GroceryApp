// The only file that talks to Parse about users.
// Screens call these functions and never use Parse.User directly.
import Parse from "./backend";

// Turns a Parse user into a plain object for the screens
function toUser(parseUser) {
  if (!parseUser) return null;
  return { id: parseUser.id, username: parseUser.get("username") };
}

// Turns Parse error codes into short messages for the user
function friendlyMessage(error) {
  switch (error.code) {
    // Same message for wrong username and wrong password,
    // so we don't reveal which usernames exist.
    case Parse.Error.OBJECT_NOT_FOUND: // 101
      return "Wrong username or password.";
    case Parse.Error.USERNAME_TAKEN: // 202
      return "This username is already taken.";
    case Parse.Error.CONNECTION_FAILED: // 100
      return "No connection. Check your internet and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// Creates a new account and logs the user in.
export async function register(username, password) {
  const user = new Parse.User();
  user.set("username", username.trim());
  // No trim() on the password: spaces can be part of it.
  user.set("password", password);
  try {
    await user.signUp();
    return toUser(user);
  } catch (error) {
    throw new Error(friendlyMessage(error), { cause: error });
  }
}

// Logs in an existing user.
export async function login(username, password) {
  try {
    const user = await Parse.User.logIn(username.trim(), password);
    return toUser(user);
  } catch (error) {
    throw new Error(friendlyMessage(error), { cause: error });
  }
}

// Logs out and removes the saved session from the browser.
export async function logout() {
  await Parse.User.logOut();
}

// Returns the logged-in user, or null. Works after a page reload too.
export function getCurrentUser() {
  return toUser(Parse.User.current());
}