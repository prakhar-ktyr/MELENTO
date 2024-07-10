const util = require('../util/util');
const util2 = require('../util/util2')
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
            let result = await addObject(coll, document);;
            
            console.log('collection name ' , collectionName) ; 
            console.log('new document' , document) ; 

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
            console.log( 'update document', updatedDocument) ; 
            console.log(collectionName);
            let result ;
            if(collectionName == 'assessmentTrainees'){
                result = await coll.updateOne({ _id: String(id)}, { $set: updatedDocument });
            }
            else{
                result = await coll.updateOne({ _id: Number(id)}, { $set: updatedDocument });
            }
            if (result.matchedCount > 0) {
                console.log("Document updated");
                resolve(result);
            } else {
                console.log('Could not update')
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
            console.log('delete document called')
            const coll = await util.connect(collectionName);
            let result ;
            if(collectionName == 'cart'){
                result = await coll.deleteOne({ _id: Number(id) });
            }
            else{
                result =  await coll.deleteOne({ _id: String(id) });
            }
            if (result.deletedCount > 0) {
                console.log("Document deleted");
                resolve(result);
            } else {
                console.log('could not delete')
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
            const item = await coll.findOne({email : credentials.email});
    
            let correctPassword = item.password ; 
            let inputPassword = credentials.password ;
            let match = await util.comparePassword(inputPassword , correctPassword) ; 
            if(match) resolve(item);
            else throw new Error('Invalid credentials')
        } catch (err) {
            reject(err);
        }
    });
}

// Add a new user with password encryption 
async function addUser(collectionName, document) {
    return new Promise(async (resolve, reject) => {
        try {
            const coll = await util.connect(collectionName);
            let password = document.password ; 
            // password = await util.hashPassword(password) ; 
            password = util2.encrypt(password) ;
            console.log('inside add user , password : ' , password) ; 
            document.password = password ; 
            const result = await addObject(coll, document);
            resolve(result);
        } catch (err) {
            reject(err);
        }
    });
}

async function getCartByUserId(collectionName , userIdInput){
    return new Promise(async (resolve, reject) => {
        try {
            const coll = await util.connect(collectionName);
            const cart = await coll.findOne({ userId : Number(userIdInput) });
            resolve(cart);
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
    findUserByCreds,
    addUser , 
    getCartByUserId
};
