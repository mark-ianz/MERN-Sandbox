import { matchedData, validationResult } from "express-validator";
import Post from "../model/PostSchema.js";
import mongoose from "mongoose";

export const get_all_post = async (req, res) => {
  try {
    // Get the user ID
    const user_id = req.user._id;

    // Initiate the limit
    const limit = req.query.limit || 5;
    const posts = await Post.find({ user_id }).limit(limit);

    // Count all the posts where it matches the user_id
    const totalPosts = await Post.countDocuments({ user_id });

    res.json({ posts, totalPosts });
  } catch (error) {
    res
      .status(500)
      .json({ error: 
        "There was a server error. Please try again later." 
      });
  }
};

export const create_post = async (req, res) => {
  // Handle validation errors
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array()[0].msg });
  }
  const { title, description } = matchedData(req);

  try {
    // Get the user ID
    const user_id = req.user._id;

    // Create new Post object
    const post = new Post({ title, description, user_id });
    
    // Save and response
    post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "There was an error." });
    console.log(error);
  }
};

export const delete_post = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No post with that id" });
    }
    const post = await Post.findByIdAndDelete(id);
    res.status(200).send({ post, message: "Successfully Deleted!" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const update_post = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No post with that id" });
    }

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array()[0].msg });
    }

    const { title, description } = matchedData(req);

    const post = await Post.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    res.status(200).send(post);
  } catch (error) {
    res.status(500).send(error);
  }
};
