const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const findRepo = repositories.find(repo => repo.id === id);
  const findRepoIndex = repositories.findIndex(repo => repo.id === id);

  if(!findRepo) {
    return response.status(400).json({ msg: 'repo does not exists'});
  }

  const newRepo = Object.assign(findRepo, { title, url, techs });
  
  repositories[findRepoIndex] = newRepo;

  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepoIndex = repositories.findIndex(repo => repo.id === id);

  if (findRepoIndex === -1) {
    return response.status(400).json({ msg: 'you can delete a non-existing repo' })
  }

  repositories.splice(findRepoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepo = repositories.find(repo => repo.id === id);
  const findRepoIndex = repositories.findIndex(repo => repo.id === id);

  if(!findRepo) {
    return response.status(400).json({ msg: 'you can like a non-existing repo' })
  }

  const repo = Object.assign(findRepo, { likes: findRepo.likes + 1 });

  repositories[findRepoIndex] = repo;

  return response.json(repo);
});

module.exports = app;
