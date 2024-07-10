require('dotenv').config();
const bcrypt = require('bcryptjs');
const MongoClient = require('mongodb').MongoClient;
const crypto = require('crypto');

// Encryption and Decryption settings
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

async function connect(collectionName) { 
    const conn = new MongoClient(process.env.MONGO_URI);
    await conn.connect();
    console.log("Connected to database");
    const myDB = conn.db('MELENTO_Mongodb');
    // const myDB = conn.db('assessments');
    const coll = myDB.collection(collectionName);
    return coll;
}

function renamekey(obj, oldkey, newkey) {
    obj[newkey] = obj[oldkey];
    delete obj[oldkey];
}

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

async function hashPassword(plainTextPassword) {
    try {
        const salt = await bcrypt.genSalt(5);
        const hash = await bcrypt.hash(plainTextPassword, salt);
        console.log("Hashed Password:", hash);
        return hash;
    } catch (err) {
        console.error(err);
        throw err; // Re-throw the error to handle it outside of this function if necessary
    }
}

// Function to compare a plain text password with a hashed password
async function comparePassword(plainTextPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
        console.log("Password Match:", isMatch);
        return isMatch;
    } catch (err) {
        console.error(err);
        throw err; // Re-throw the error to handle it outside of this function if necessary
    }
}

module.exports = {
    connect,
    renamekey,
    hashPassword,
    comparePassword,
    encrypt,
    decrypt
};
