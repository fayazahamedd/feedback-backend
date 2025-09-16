const mongoose = require("mongoose");

// Schema
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
    // Connect to MongoDB only once per cold start
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }

    // 📌 GET - fetch all feedback
    if (event.httpMethod === "GET") {
      const feedbacks = await Feedback.find({});
      return {
        statusCode: 200,
        body: JSON.stringify(feedbacks),
      };
    }

    // 📌 POST - save new feedback
    if (event.httpMethod === "POST") {
      const data = JSON.parse(event.body);
      const newFeedback = new Feedback(data);
      await newFeedback.save();
      return {
        statusCode: 201,
        body: JSON.stringify({ message: "Feedback saved successfully" }),
      };
    }

    // 📌 DELETE - remove by id
    if (event.httpMethod === "DELETE") {
      const { id } = JSON.parse(event.body);
      const deleted = await Feedback.findByIdAndDelete(id);
      if (!deleted) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Not found" }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Feedback deleted successfully" }),
      };
    }

    // 📌 PUT - update by id
    if (event.httpMethod === "PUT") {
      const { id, updateData } = JSON.parse(event.body);
      const updated = await Feedback.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Not found" }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Feedback updated successfully",
          data: updated,
        }),
      };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
