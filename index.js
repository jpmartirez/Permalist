import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: '******',
  password: '******',
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM todolist ORDER BY id ASC;");

  let items = [];

  result.rows.forEach((task) => {
    items.push(task);
  });

  console.log(items);

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  
  if (item !== "") {
    try {
      await db.query("INSERT INTO todolist (title) VALUES ($1);", [item]);
    } catch (error) {
      console.log(error);
    }
  } 

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const updatedName = req.body.updatedItemTitle;
  const taskId = req.body.updatedItemId;

  if (updatedName === "") {return res.redirect("/");}

  try {
    await db.query("UPDATE todolist SET title = $1 WHERE id=$2;", [updatedName, taskId]);
    
  } catch (error) {
    console.log(error);
  }

  res.redirect("/");
 
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  console.log(id);

  try {
    await db.query("DELETE FROM todolist WHERE id = $1;", [id]);
  } catch (error) {
    console.log(error);
  }

  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
