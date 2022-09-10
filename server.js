



const PORT = process.env.PORT || 3001;

const fs = require("fs");
const path = require("path");
const express = require("express");


const app = express();
const allNotes = require("./db/db.json");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/api/notes", (request, response) => {

    console.log(allNotes);
    response.json(allNotes);
});

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (request, response) => {
    response.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./public/index.html"));
});


function createNewNote(body, notesArray) {

    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];

    if (notesArray.length === 0)
        notesArray.push(0);

    const newNoteId = notesArray[0].id + 1;

    body.id = newNoteId
    
    console.log("notesArray", notesArray);
    console.log(newNote);

    notesArray.push(newNote);
    fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray, null, 2));

    return newNote;
}

app.post("/api/notes", (request, response) => {

    const newNote = createNewNote(request.body, allNotes);
    response.json(newNote);
});


function deleteNote(id, notesArray) {

    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray, null, 2));

            break;
        }
    }
}


app.delete("/api/notes/:id", (request, response) => {

    deleteNote(request.params.id, allNotes);
    response.json(true);
});

app.listen(PORT, () => {
    console.log(`API Server is now on port ${PORT}`);
});

