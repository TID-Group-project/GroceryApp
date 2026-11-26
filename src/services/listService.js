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

// Loads all lists for the home screen (owned + shared with me) with an isShared flag
export async function loadAllUserLists() {
  const currentUser = Parse.User.current();

  const [ownedLists, sharedWithMeRows] = await Promise.all([
    new Parse.Query(List).equalTo("owner", currentUser).find(),
    new Parse.Query(ListMember)
      .equalTo("user", currentUser)
      .include("list")
      .find(),
  ]);

  // Check which owned lists have shared members in ListMember
  const sharedOwnedIds = new Set();
  if (ownedLists.length > 0) {
    const memberRows = await new Parse.Query(ListMember)
      .containedIn("list", ownedLists)
      .find();

    for (const row of memberRows) {
      const listId = row.get("list")?.id;
      const memberUserId = row.get("user")?.id;
      if (listId && memberUserId && memberUserId !== currentUser?.id) {
        sharedOwnedIds.add(listId);
      }
    }
  }

  const results = ownedLists.map((list) => ({
    id: list.id,
    name: list.get("name"),
    isShared: sharedOwnedIds.has(list.id),
  }));

  const seenIds = new Set(results.map((l) => l.id));

  for (const row of sharedWithMeRows) {
    const list = row.get("list");
    if (list && !seenIds.has(list.id)) {
      seenIds.add(list.id);
      results.push({
        id: list.id,
        name: list.get("name"),
        isShared: true,
      });
    }
  }

  return results;
}
