/* 
  Trigger on mongo atlas
*/

exports = function () {
  const mongodb = context.services.get("mongodb-atlas");
  const houses = mongodb.db("pepe-house").collection("houses");

  return houses
    .aggregate([
      {
        $match: {
          expireAt: {
            $lte: new Date(),
          },
        },
        $set: {
          status: 1,
        },
      },
    ])
    .next()
    .then(() => console.log("Update status successfully"))
    .catch((err) => console.error("Failed to update status:", err));
};
