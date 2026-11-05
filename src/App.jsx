import { useEffect } from "react";
import Parse from "./services/backend";

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
  return <h1>Grocery app</h1>;
}
export default App;
