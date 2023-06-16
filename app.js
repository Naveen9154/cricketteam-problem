const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());

const database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const cdbObjectToReOb = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPq = `SELECT
    *
    FROM
     cricket_team;`;
  const pa = await database.all(getPq);
  response.send(pa.map((ep) => cdbObjectToReOb(ep)));
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPq = `SELECT
         *
    FROM
     cricket_team
      WHERE
       player_id=${playerId};`;
  const pa = await database.get(getPq);
  response.send(cdbObjectToReOb(pa));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPq = `INSERT INTO
     cricket_team(player_name,jersey_name,role)
    VALUES 
    ('${playerName}','${jerseyNumber}','${role}'`;
  const pa = await database.run(postPq);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePq = `UPDATE
     cricket_team
      SET 
    player_name='${playerName}',
    jersey_number='${jerseyNumber}',
    role='${role}'
    WHERE
     player_id=${playerId}`;
  const pa = await database.run(updatePq);
  response.send("Player Details updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePq = `DELETE 
    FROM
     cricket_team
      WHERE
       player_id=${playerId};`;
  const pa = await database.run(deletePq);
  response.send(console.log("player removed"));
});

module.exports = app;
