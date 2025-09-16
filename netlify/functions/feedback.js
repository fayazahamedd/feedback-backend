const mongoose = require("mongoose");

// CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// MongoDB Schema
const feedbackSchema = new mongoose.Schema({
  componentData: Array,
  rightPanelData: Object,
});

// Prevent model overwrite in Lambda
const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

let isConnected = false;

exports.handler = async (event) => {
  try {
    // Handle preflight OPTIONS request
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: CORS_HEADERS,
        body: "",
      };
    }

    // Connect to MongoDB only once per cold start
    if (!isConnected) {
      if (!process.env.MONGODB_URI) {
        throw new Error(
          "MONGODB_URI is not defined in Netlify environment variables."
        );
      }
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }

    // GET all feedback
    if (event.httpMethod === "GET") {
      const feedbacks = await Feedback.find({});
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(feedbacks),
      };
    }

    // POST - create feedback
    if (event.httpMethod === "POST") {
      const data = JSON.parse(event.body);
      const newFeedback = new Feedback(data);
      await newFeedback.save();
      return {
        statusCode: 201,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Feedback saved successfully" }),
      };
    }

    // DELETE feedback by ID
    if (event.httpMethod === "DELETE") {
      const { id } = JSON.parse(event.body);
      const deleted = await Feedback.findByIdAndDelete(id);
      if (!deleted) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Feedback not found" }),
        };
      }
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ message: "Feedback deleted successfully" }),
      };
    }

    // PUT - update feedback by ID
    if (event.httpMethod === "PUT") {
      const { id, updateData } = JSON.parse(event.body);
      const updated = await Feedback.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Feedback not found" }),
        };
      }
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          message: "Feedback updated successfully",
          data: updated,
        }),
      };
    }

    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: "Method Not Allowed",
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
