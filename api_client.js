const BASE_URL = `https://jsonbox.io/`;
const BOX_ID = `box_ffbcc93508501a9a8120/`;
let RECORD_ID = null;
let newToDo = { description: "", done: false };

const noteGET = async () => {
  try {
    let response = await fetch(`${BASE_URL}${BOX_ID}`, {
      method: `GET`,
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const notePOST = async () => {
  try {
    let response = await fetch(`${BASE_URL}${BOX_ID}`, {
      method: `POST`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newToDo),
    });
    newToDo = { description: "", done: false };
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
const noteDELETE = async () => {
  try {
    let response = await fetch(`${BASE_URL}${BOX_ID}${RECORD_ID}`, {
      method: `DELETE`,
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const noteEDIT = async () => {
  try {
    let response = await fetch(`${BASE_URL}${BOX_ID}${RECORD_ID}`, {
      method: `PUT`,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newToDo),
    });
    return await response.json(newToDo);
  } catch (error) {
    console.error(error);
  }
};
