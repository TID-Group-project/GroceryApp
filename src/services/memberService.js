//Developing code -  Ivana

// The only file that talks to Parse about list members and sharing.
import Parse from "./backend";

const List = Parse.Object.extend("List");
const Item = Parse.Object.extend("Item");
const ListMember = Parse.Object.extend("ListMember");

// Fetches the list's title and owner ID
export async function getListDetails(listId) {
  const query = new Parse.Query(List);
  const list = await query.get(listId);
  return {
    id: list.id,
    name: list.get("name"),
    ownerId: list.get("owner")?.id ?? null,
  };
}

// Fetches all current members of a list (owner + shared members)
export async function getListMembers(listId) {
  const listPointer = List.createWithoutData(listId);

  // 1. Fetch the list to get its owner
  const listQuery = new Parse.Query(List);
  listQuery.include("owner");
  const list = await listQuery.get(listId);
  const owner = list.get("owner");

  // 2. Fetch all ListMember rows for this list
  const memberQuery = new Parse.Query(ListMember);
  memberQuery.equalTo("list", listPointer);
  memberQuery.include("user");
  const rows = await memberQuery.find();

  const members = [];

  // Ensure owner appears first
  if (owner) {
    const ownerRow = rows.find((r) => r.get("user")?.id === owner.id);
    members.push({
      memberRecordId: ownerRow ? ownerRow.id : null,
      userId: owner.id,
      username: owner.get("username"),
      isOwner: true,
    });
  }

  // Add remaining shared members
  for (const row of rows) {
    const user = row.get("user");
    if (user && user.id !== owner?.id) {
      members.push({
        memberRecordId: row.id,
        userId: user.id,
        username: user.get("username"),
        isOwner: false,
      });
    }
  }

  return members;
}

// Fetches all registered users who are not already members of this list
export async function getAvailableUsers(existingUserIds = []) {
  const query = new Parse.Query(Parse.User);
  query.ascending("username");
  if (existingUserIds.length > 0) {
    query.notContainedIn("objectId", existingUserIds);
  }
  const users = await query.find();
  return users.map((u) => ({
    id: u.id,
    username: u.get("username"),
  }));
}

// Shares the list with an array of selected users ({ id, username })
export async function addMembersToList(listId, selectedUsers) {
  const list = await new Parse.Query(List).get(listId);
  const items = await new Parse.Query(Item).equalTo("list", list).find();

  const listAcl = list.getACL() ?? new Parse.ACL(Parse.User.current());
  const objectsToSave = [];

  for (const friend of selectedUsers) {
    const friendPointer = Parse.User.createWithoutData(friend.id);

    // Grant read & write access on the list and all its items
    listAcl.setReadAccess(friend.id, true);
    listAcl.setWriteAccess(friend.id, true);

    // Create ListMember row
    const member = new ListMember();
    member.set("list", list);
    member.set("user", friendPointer);

    const memberAcl = new Parse.ACL(Parse.User.current());
    memberAcl.setReadAccess(friend.id, true);
    memberAcl.setWriteAccess(friend.id, true);
    member.setACL(memberAcl);

    objectsToSave.push(member);
  }

  list.setACL(listAcl);
  items.forEach((item) => item.setACL(listAcl));

  await Parse.Object.saveAll([list, ...items, ...objectsToSave]);
}

// Removes a single member from the list and revokes their ACL access
export async function removeMemberFromList(listId, memberRecordId, userId) {
  const list = await new Parse.Query(List).get(listId);
  const items = await new Parse.Query(Item).equalTo("list", list).find();

  // Revoke read & write access
  const listAcl = list.getACL();
  if (listAcl) {
    listAcl.setReadAccess(userId, false);
    listAcl.setWriteAccess(userId, false);
    list.setACL(listAcl);
    items.forEach((item) => item.setACL(listAcl));
  }

  await Parse.Object.saveAll([list, ...items]);

  if (memberRecordId) {
    const memberRecord = ListMember.createWithoutData(memberRecordId);
    await memberRecord.destroy();
  }
}

// Deletes the list, all its items, and all ListMember rows for everyone
export async function deleteListForEveryone(listId) {
  const list = await new Parse.Query(List).get(listId);
  const items = await new Parse.Query(Item).equalTo("list", list).find();
  const members = await new Parse.Query(ListMember)
    .equalTo("list", list)
    .find();

  await Parse.Object.destroyAll([...items, ...members, list]);
}
