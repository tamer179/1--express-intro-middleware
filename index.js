import express from "express";
import { createDB } from "./db.js";

const app = express();
const db = createDB();

app.use(express.json());

app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

// get all users from db

app.get("/authors", async (req, res) => {
  const authors = await db.getAll("authors");
  // send as json
  res.json({
    data: authors,
  });
});

// Get one
app.get("/authors/:author_id", async (req, res) => {
    // get user by id from database
  const author = await db.getById("authors", req.params.author_id);
  //send as json
  res.json({
    data: author,
  });
});
// Create author
app.post("/authors", async (req, res) => {
  // get data from req body
  const authorData = req.body;
  // add to database
  await db.create("authors", authorData);

  // return response
  res.status(201).json({
    message: "author created successfully",
  });
});

// Update authors
app.patch("/authors/:author_id", async (req, res) => {
  // get id from params
  const id = req.params.author_id;

  // check database
  const author = await db.getById("authors", id);

  if (!author) {
    return res.status(404).json({
      message: "author not found",
    });
  }

  // get data from body
  const updateData = req.body;

  // update in database
  await db.update("authors", id, updateData);

  const newAuthors = await db.getById("authors", id);

  // return res
  return res.status(200).json({
    message: "author updated successfully",
    data: newAuthors,
  });
});

// Delete author

app.delete("/authors/:author_id", async (req, res) => {
  // get id from params
  const id = req.params.author_id;

  // check if in database
  const author = await db.getById("authors", id);

  // if present delete -> return res
  if (author) {
    await db.delete("authors", id);
    return res.status(204).json({
      message: "author deleted successfully",
    });
  } else {
    // if not present -> 404
    return res.status(404).json({
      message: "author not found",
    });
  }
});

//  Search for authors

app.get("/authors/search", async (req, res) => {
  const search = req.query.search;

  const authors = await db.search("authors", search);

  if (authors.length === 0) {
    return res.status(404).json({
      message: "Author Not Found",
    });
  }

  res.status(200).json({
    data: authors,
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});