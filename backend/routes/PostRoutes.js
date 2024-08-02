import express from "express";
import {
  create_post,
  get_all_post,
  delete_post,
  update_post,
} from "../controller/PostController.js";
import { post_validator } from "../util/validators.js";
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

// Protection
router.use(requireAuth);

router.get("/", get_all_post);
router.post("/", post_validator, create_post);
router.delete("/:id", delete_post);
router.patch("/:id", post_validator, update_post);

export default router;
