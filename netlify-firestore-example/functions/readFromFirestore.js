// functions/readFromFirestore.js
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS); // Path to your Firebase credentials

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event, context) => {
  // Parse query parameters
  const { collection, id } = event.queryStringParameters;

  // Validate input
  if (!collection || !id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Collection and ID are required" }),
    };
  }

  try {
    // Fetch data from Firestore
    const docRef = db.collection(collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Document not found" }),
      };
    }

    // Return the document data ok
    return {
      statusCode: 200,
      body: JSON.stringify(doc.data()),
    };
  } catch (err) {
    console.error("Firestore error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};