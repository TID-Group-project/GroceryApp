import { useEffect } from "react";
import Parse from "./services/backend";
import Typography from "@mui/material/Typography";
import Button from "./components/common/Button";
import { tokens } from "./theme/tokens";

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
  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h1">Grocery app</Typography>
      {/* 8px between tap targets (NFR5) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: tokens.space[2] }}>
        <Button>Create list</Button>
        <Button variant="outlined">Share</Button>
        <Button color="error">Delete list</Button>
      </div>
    </div>
  );
}
export default App;
