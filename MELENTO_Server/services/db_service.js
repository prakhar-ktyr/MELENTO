const util = require('../util/util');
const util2 = require('../util/util2');
const bcrypt = require('bcryptjs');

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
    let coll;
    try {
        coll = await util.connect(collectionName);
        const items = await coll.find().toArray();
        return items;
    } catch (err) {
        throw err;
    } 
    // finally {
    //     await util.disconnect(); // Close connection
    // }
}

// Find document by ID in a collection
async function findById(collectionName, id) {
    let coll;
    try {
        coll = await util.connect(collectionName);
        const item = await coll.findOne({ _id: id });
        return item;
    } catch (err) {
        throw err;
    } 
    // finally {
    //     await util.disconnect(); // Close connection
    // }
}

// Add a new document to a collection
async function addDocument(collectionName, document) {
    let coll;
    try {
        coll = await util.connect(collectionName);
        let result = await addObject(coll, document);
        console.log('collection name ', collectionName);
        console.log('new document', document);
        return result;
    } catch (err) {
        throw err;
    } 
    // finally {
    //     await util.disconnect(); // Close connection
    // }
}

// Update a document in a collection
async function updateDocument(collectionName, id, updatedDocument) {
    let coll;
    try {
        coll = await util.connect(collectionName);
        console.log('update document', updatedDocument);
        console.log(collectionName);
        let result;
        if (collectionName === "cart" || collectionName === "reports") {
            result = await coll.updateOne({ _id: Number(id)}, { $set: updatedDocument });
        } else {
            result = await coll.updateOne({ _id: String(id)}, { $set: updatedDocument });
        }
        if (result.matchedCount > 0) {
            console.log("Document updated");
            return result;
        } else {
            console.log('Could not update');
            return null;
        }
    } catch (err) {
        throw err;
    } 
    // finally {
    //     await util.disconnect(); // Close connection
    // }
}

// Delete a document in a collection
async function deleteDocument(collectionName, id) {
    let coll;
    try {
        console.log('delete document called');
        coll = await util.connect(collectionName);
        let result;
        if (collectionName === 'cart') {
            result = await coll.deleteOne({ _id: Number(id) });
        } else {
            result = await coll.deleteOne({ _id: String(id) });
        }
        if (result.deletedCount > 0) {
            console.log("Document deleted");
            return result;
        } else {
            console.log('Could not delete');
            return null;
        }
    } catch (err) {
        throw err;
    } 
    // finally {
    //     await util.disconnect(); // Close connection
    // }
}

// Find user by credentials
async function findUserByCreds(collectionName, credentials) {
    let coll;
    try {
        coll = await util.connect(collectionName);
        const item = await coll.findOne({ email: credentials.email });

        let encryptedPassword = item.password;
        let decryptedPassword = util.decrypt(encryptedPassword); // Decrypt the password
        let inputPassword = credentials.password;

        let match = (inputPassword === decryptedPassword);
        if (match) return item;
        else throw new Error('Invalid credentials');
    } catch (err) {
        throw err;
    } 
    // finally {
    //     await util.disconnect(); // Close connection
    // }
}

// Add a new user with password encryption
async function addUser(collectionName, document) {
    let coll;
    try {
        coll = await util.connect(collectionName);
        let password = document.password;
        password = util.encrypt(password); // Encrypt the password
        document.password = password;
        const result = await addObject(coll, document);
        return result;
    } catch (err) {
        throw err;
    } 
    // finally {
    //     await util.disconnect(); // Close connection
    // }
}

// Get cart by userId
async function getCartByUserId(collectionName, userIdInput) {
    let coll;
    try {
        coll = await util.connect(collectionName);
        const cart = await coll.findOne({ userId: Number(userIdInput) });
        return cart;
    } catch (err) {
        throw err;
    } 
    // finally {
    //     await util.disconnect(); // Close connection
    // }
}

module.exports = {
    findAll,
    findById,
    addDocument,
    updateDocument,
    deleteDocument,
    findUserByCreds,
    addUser,
    getCartByUserId
};
