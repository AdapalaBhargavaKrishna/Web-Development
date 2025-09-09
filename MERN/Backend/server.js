const express = require("express");
const app = express();

const PORT = 5000;

app.use(express.json());

let videos = [
  { id: 1, title: "Node js", duration: "11min" },
  { id: 2, title: "React js", duration: "10min" },
  { id: 3, title: "Express js", duration: "7min" },
  { id: 4, title: "Next js", duration: "20min" },
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// CREATE

app.post("/videos", (req, res) => {
  const video = req.body;

  if (!video || !video.title || !video.duration) {
    return res.status(400).json({ message: "Invalid video data" });
  }

  const newId = videos.length ? videos[videos.length - 1].id + 1 : 1;

  videos.push({ id: newId, ...video });
  res.json({ message: "Video added", video: { id: newId, ...video } });
});

// READ

app.get("/videos", (req, res) => {
  if (!videos.length) {
    return res.status(404).json({ message: "No videos found" });
  }
  res.json(videos);
});

app.get("/videos/:id", (req, res) => {
  const videoId = parseInt(req.params.id);

  const video = videos.find((v) => v.id === videoId);
  if (video) {
    res.json(video);
  } else {
    res.status(404).json({ message: "Video not found", id: videoId });
  }
});

// UPDATE

app.put("/videos/:id", (req, res) => {
  const videoId = parseInt(req.params.id);
  const updatedVideo = req.body;

  const video = videos.find((v) => v.id === videoId);

  if (video) {
    if (!updatedVideo.title && !updatedVideo.duration) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    video.title = updatedVideo.title || video.title;
    video.duration = updatedVideo.duration || video.duration;
    res.json({ message: "Video updated", video });
  } else {
    res.status(404).json({ message: "Video not found", id: videoId });
  }
});

// DELETE

app.delete("/videos/:id", (req, res) => {
  const videoId = parseInt(req.params.id);
  let video = videos.find((v) => v.id === videoId);

  if (!video) {
    return res.status(404).json({ message: "Video not found", id: videoId });
  }

  videos = videos.filter((v) => v.id !== videoId);
  res.json({ message: "Video deleted", id: videoId, video });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
