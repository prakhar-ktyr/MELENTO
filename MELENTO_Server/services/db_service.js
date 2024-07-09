const util = require('../util/util');

// Helper function to add an object to the collection
async function addObject(collection, object) {
    return new Promise((resolve, reject) => {
        collection.insertOne(object, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log("Object added");
                resolve(result);
            }
        });
    });
}

// Find all documents in a collection
async function findAll(collectionName) {
    return new Promise(async (resolve, reject) => {
        try {
            const coll = await util.connect(collectionName);
            const items = await coll.find().toArray();
            // console.log(items);
            resolve(items);
        } catch (err) {
            reject(err);
        }
    });
}

// Find document by ID in a collection
async function findById(collectionName, id) {
    return new Promise(async (resolve, reject) => {
        try {
            const coll = await util.connect(collectionName);
            const item = await coll.findOne({ _id: id });
            // console.log(item);
            resolve(item);
        } catch (err) {
            reject(err);
        }
    });
}

// Add a new document to a collection
async function addDocument(collectionName, document) {
    return new Promise(async (resolve, reject) => {
        try {
            const coll = await util.connect(collectionName);
            const result = await addObject(coll, document);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

// Update a document in a collection
async function updateDocument(collectionName, id, updatedDocument) {
    return new Promise(async (resolve, reject) => {
        try {
            const coll = await util.connect(collectionName);
            const result = await coll.updateOne({ _id: id }, { $set: updatedDocument });
            if (result.matchedCount > 0) {
                console.log("Document updated");
                resolve(result);
            } else {
                resolve(null);
            }
        } catch (err) {
            reject(err);
        }
    });
}

// Delete a document in a collection
async function deleteDocument(collectionName, id) {
    return new Promise(async (resolve, reject) => {
        try {
            const coll = await util.connect(collectionName);
            const result = await coll.deleteOne({ _id: id });
            if (result.deletedCount > 0) {
                console.log("Document deleted");
                resolve(result);
            } else {
                resolve(null);
            }
        } catch (err) {
            reject(err);
        }
    });
}

// Find user for authentication
async function findUserByCreds(collectionName, credentials) {
    return new Promise(async (resolve, reject) => {
        try {
            const coll = await util.connect(collectionName);
            const item = await coll.findOne(credentials);
            // console.log(item);
            resolve(item);
        } catch (err) {
            reject(err);
        }
    });
}


module.exports = {
    findAll,
    findById,
    addDocument,
    updateDocument,
    deleteDocument,
    findUserByCreds
};
