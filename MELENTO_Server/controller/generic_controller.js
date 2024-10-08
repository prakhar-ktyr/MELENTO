const db_service = require('../services/db_service');
const util = require('../util/util');

function getDocuments(collectionName) {
    return (req, res) => {
        db_service.findAll(collectionName).then(
            (items) => {
                const objArr = items;
                objArr.forEach((obj) => {
                    util.renamekey(obj, "_id", "id");
                    if (collectionName === 'users' && obj.password) {
                        obj.password = util.decrypt(obj.password); // Decrypt the password
                    }
                });
                const updatedItems = JSON.stringify(objArr);
                res.setHeader('Content-Type', 'application/json');
                res.send(updatedItems);
            },
            (err) => {
                res.status(500).json({ message: err.message });
            }
        ).catch((error) => {
            res.status(500).json({ message: error.message });
        });
    };
}


function getDocumentById(collectionName) {
    return (req, res) => {
        db_service.findById(collectionName, req.params.id).then(
            (item) => {
                if (item) {
                    util.renamekey(item, "_id", "id");
                    if (collectionName === 'users' && item.password) {
                        item.password = util.decrypt(item.password); // Decrypt the password
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(item));
                } else {
                    res.status(404).json({ message: 'Document not found' });
                }
            },
            (err) => {
                res.status(500).json({ message: err.message });
            }
        ).catch((error) => {
            res.status(500).json({ message: error.message });
        });
    };
}


function addDocument(collectionName) {
    return (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        util.renamekey(req.body , "id" , "_id")
        if(collectionName === 'users'){
            db_service.addUser(collectionName, req.body).then(
                (result) => {
                    res.send(result);
                }
       
            ).catch((error) => {
                res.status(500).json({ message: error.message });
            });
        }
        else{
           
            db_service.addDocument(collectionName, req.body).then(
                (result) => {
                    console.log('generic controller add document called')
                    res.send(result);
                }
       
            ).catch((error) => {
                res.status(500).json({ message: error.message });
            });
        }
    };
}

// generic_controller.js
function updateDocument(collectionName) {
    return (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        if (collectionName === 'users' && req.body.password) {
            req.body.password = util.encrypt(req.body.password); // Encrypt the password
        }
        db_service.updateDocument(collectionName, req.params.id, req.body).then(
            (result) => {
                res.send(result);
            },
            (err) => {
                res.status(500).json({ message: err.message });
            }
        ).catch((error) => {
            res.status(500).json({ message: error.message });
        });
    };
}


function deleteDocument(collectionName) {
    return (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        db_service.deleteDocument(collectionName, req.params.id).then(
            (result) => {
                if (result) {
                    res.json({ message: 'Document deleted' });
                } else {
                    res.status(404).json({ message: 'Document not found' });
                }
            },
            (err) => {
                res.status(500).json({ message: err.message });
            }
        ).catch((error) => {
            res.status(500).json({ message: error.message });
        });
    };
}

const getUserByCredentials = (collectionName, credentials) => {
    return new Promise((resolve, reject) => {
        db_service.findUserByCreds(collectionName, credentials)
            .then(foundUser => {
                if (foundUser) {
                    // util.renamekey(foundUser, "_id", "id");
                    console.log('generic controller get user by creds' ,foundUser)
                    resolve(foundUser);
                } else {
                    reject(new Error('Document not found'));
                }
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getCartByUserId = (collectionName) => {
    return (req, res) => {
        db_service.getCartByUserId(collectionName, req.params.id).then(
            (item) => {
                if (item) {
                    // util.renamekey(item, "_id", "id");
                    res.setHeader('Content-Type', 'application/json');
                    res.send({
                        cart : JSON.stringify(item) , 
                        found : true 
                    });
                } else {
                    // res.status(404).json({ message: 'Document not found' });
                    res.send({
                        found : false 
                    })
                }
            }
        ).catch((error) => {
            res.status(500).json({ message: error.message });
        });
    };
}
module.exports = {
    getDocuments,
    getDocumentById,
    addDocument,
    updateDocument,
    deleteDocument,
    getUserByCredentials,
    getCartByUserId
};