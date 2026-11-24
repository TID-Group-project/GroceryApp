import Parse from "./backend.js";

const Item = Parse.Object.extend("Item");

// a row from the database, as the components want to see it
function toItem(item) {
  return {
    id: item.id,
    name: item.get("name"),
    done: item.get("done"),
  };
}

export async function loadItems(list) {
  const results = await new Parse.Query(Item)
    .equalTo("list", list)
    .ascending("createdAt")
    .find();

  return results.map(toItem);
}

export async function addItem(list, name) {
  const item = new Item();
  item.set("name", name);
  item.set("done", false);
  item.set("list", list);

  // the item follows its list: whoever may use the list may use the item
  const acl = list.getACL();
  if (acl) item.setACL(acl);

  return toItem(await item.save());
}

export async function deleteItem(id) {
  // we only have the id, so we build a stand-in object pointing at that row
  await Item.createWithoutData(id).destroy();
}

// check or uncheck an item
export async function setDone(id, done) {
  const item = Item.createWithoutData(id);
  item.set("done", done);
  await item.save();
}
