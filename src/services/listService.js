import Parse from "./backend.js";

const List = Parse.Object.extend("List");
const Item = Parse.Object.extend("Item");
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

// Changes the name of a list.
// Members have write access to the list too, so any member can rename it.
export async function renameList(listId, name) {
  // we only have the id, so we build a stand-in object pointing at that row
  const list = List.createWithoutData(listId);
  list.set("name", name);
  await list.save();
}

// Deletes a list, all its items and all its member rows, for everyone.
// Only the owner may do this (the ACL of the list allows it).
export async function deleteList(listId) {
  const list = await new Parse.Query(List).get(listId);
  const items = await new Parse.Query(Item)
    .equalTo("list", list)
    .limit(1000)
    .find();
  const members = await new Parse.Query(ListMember)
    .equalTo("list", list)
    .limit(1000)
    .find();

  await Parse.Object.destroyAll([...items, ...members, list]);
}

// Loads all lists for the home screen (owned + shared with me), as plain objects:
//   isOwner         true = I created it (I can delete it), false = I can only leave it
//   isShared        true = at least one other person is a member
//   memberCount     how many other people are members (only known for my own lists)
//   memberRecordId  my ListMember row (only for lists shared with me, needed to leave)
export async function loadAllUserLists() {
  const currentUser = Parse.User.current();

  const [ownedLists, sharedWithMeRows] = await Promise.all([
    new Parse.Query(List).equalTo("owner", currentUser).find(),
    new Parse.Query(ListMember)
      .equalTo("user", currentUser)
      .include("list")
      .find(),
  ]);

  // Count the other members of each owned list in ListMember
  const memberCounts = {};
  if (ownedLists.length > 0) {
    const memberRows = await new Parse.Query(ListMember)
      .containedIn("list", ownedLists)
      .limit(1000)
      .find();

    for (const row of memberRows) {
      const listId = row.get("list")?.id;
      const memberUserId = row.get("user")?.id;
      if (listId && memberUserId && memberUserId !== currentUser?.id) {
        memberCounts[listId] = (memberCounts[listId] ?? 0) + 1;
      }
    }
  }

  const results = ownedLists.map((list) => ({
    id: list.id,
    name: list.get("name"),
    isShared: (memberCounts[list.id] ?? 0) > 0,
    isOwner: true,
    memberCount: memberCounts[list.id] ?? 0,
    memberRecordId: null,
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
        isOwner: false,
        memberCount: null,
        memberRecordId: row.id,
      });
    }
  }

  return results;
}
