// functions/addToFirestore.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-creds.json'); // Path to your Firebase credentials

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event, context) => {
  // Parse the request body
  const { collection, data } = JSON.parse(event.body);

  // Validate input
  if (!collection || !data) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Collection and data are required" }),
    };
  }

  try {
    // Add data to Firestore
    const docRef = await db.collection(collection).add(data);

    // Return the document ID
    return {
      statusCode: 200,
      body: JSON.stringify({ id: docRef.id }),
    };
  } catch (err) {
    console.error("Firestore error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};