import Parse from "./backend.js";

const List = Parse.Object.extend("List");
const ListMember = Parse.Object.extend("ListMember");

export async function loadListsOwner() {
  return new Parse.Query(List).equalTo("owner", Parse.User.current()).find();
}

export async function loadListMembers(listId) {
  return new Parse.Query(ListMember).equalTo("list", listId).find();
}

export async function loadList(listId) {
  return new Parse.Query(List).get(listId);
}

export async function addList(name) {
  const currentUser = Parse.User.current();

  const list = new List();
  list.set("name", name);
  list.set("owner", currentUser);
  list.setACL(new Parse.ACL(currentUser));

  return list.save();
}

export async function loadSharedWithMe() {
  const rows = await new Parse.Query(ListMember)
    .equalTo("user", Parse.User.current())
    .include("list")
    .find();

  return rows.filter((row) => row.get("list"));
}
