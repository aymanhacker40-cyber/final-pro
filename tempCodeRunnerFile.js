// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("test");

// Find a document in a collection.
db.getCollection("users").findOne({

});


db.users.updateMany(
  { isAdmin: { $exists: false } },
  { $set: { isAdmin: false } }
);