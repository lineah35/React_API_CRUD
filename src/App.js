import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";

function App() {
  const [arr, setArr] = useState([]); //declaring a state in a functional component. SetArr is used to modify the state.
  const [name, setName] = useState("");

  const [updateName, setUpdateName] = useState(""); //for input field to accept new text
  const [newName, setNewName] = useState(""); //for input field to accept new text
  const [isShow, setIsShow] = useState(false); //to update the value of the state and re-render html. 
  const [selectedItem, setSelectedItem] = useState({});
  const[ancestry, setAncestry] = useState("");

async function changeGender() {
  console.log("gender:", selectedItem.gender);
   
  if(selectedItem.gender === "male") {
    selectedItem.gender = 1;
  } else if(selectedItem.gender === "female") {
    selectedItem.gender = 2;
  }
  console.log("modified gender:", selectedItem.gender);
  let result = await axios.post("http://localhost:3000/hp/new/data",
    selectedItem); //calling this post API, passing the object in the body
    console.log("result of changed ancestry:", result);
    getAllData();
  
}

  async function newAncestry () {
    console.log("current ancestry:", selectedItem.ancestry);
    selectedItem.ancestry = ancestry;
    console.log("modified ancestry:", selectedItem.ancestry);
    let result = await axios.post("http://localhost:3000/hp/new/data",
    selectedItem);
    console.log("result of changed ancestry:", result);
    getAllData();
  }


   async function matchName() {
    arr.map(async (item) => {
      if (item.name === updateName) {
        console.log("matchName item:", item); //this item is the object that comprises the req.body
        setIsShow(true);
        setSelectedItem(item); //storing character object in a state so we can access it outside the scope. The value will be in selectedItem only.
      }
    });
  }

  async function modifiedStatus() { //how do you change boolean values?I want the status to change upon button click. No input field.
    console.log("current selected item status:", selectedItem.hogwartsStudent); 
    selectedItem.hogwartsStudent = !selectedItem.hogwartsStudent; //not reverses the value
    console.log("modified status:", selectedItem.hogwartsStudent);
    let result = await axios.post("http://localhost:3000/hp/new/data",
    selectedItem);
    console.log("result of changed status:", result);
    getAllData();
  }

  async function modifiedName () {
    selectedItem.name = newName;
    console.log("selectedItem", selectedItem); //the req.body
    let result = await axios.post(
      //p1 is URL, p2 is object
      "http://localhost:3000/hp/new/data",
      selectedItem
    );
    console.log("result from modified name", result);
    getAllData();
  }

  useEffect(() => {
    console.log("use effect call"); //initializes only. called just once at the very start in this case.
    // axios.get("http://localhost:3000/hp/all/data").then((result) => {
    //   console.log("result", result);
    //   setArr(result.data.Items);
    // });
    getAllData();
  }, []);

  async function getAllData() {
    let allResults = await axios.get("http://localhost:3000/hp/all/data");
    console.log("all results:", allResults);
    setArr(allResults.data.Items);
    console.log("setArr:", setArr); //setArr refreshes the DOM and UI. It is a state, which when modified, automatically refreshes the DOM.
  }

  async function deleteCharacter() {
    arr.map(async (item) => {
      console.log("item.name in arr.map:", item.name);
      if (item.name === name) {
        let deletedCharacter = await axios.delete(
          `http://localhost:3000/hp/delete/${item.id}`
        ); //see backend for rest
        console.log("deletedCharacter", deletedCharacter);
        getAllData();
      }
    });
  }

  function purebloodNames() {
    //displaying the names
    return arr.map((name) => {
      return <p>{name.name}</p>;
    });
  }

  async function addCharacter() {
    console.log("clicked!");
    let newCharacter = {
      id: 107,
      name: "Luna Lovegood",
      alternate_names: [],
      species: "witch",
      gender: "male",
      house: "",
      dateOfBirth: "",
      yearOfBirth: "",
      wizard: true,
      ancestry: "half-blood",
      eyeColour: "",
      hairColour: "brown",
      wand: {
        wood: "",
        core: "",
        length: "",
      },
      patronus: "",
      hogwartsStudent: true,
      hogwartsStaff: false,
      actor: "Sophie Bert",
      alternate_actors: [],
      alive: true,
      image: "",
    };

    let result = await axios.post(
      //p1 is URL, p2 is object
      "http://localhost:3000/hp/new/data",
      newCharacter
    );
    console.log("result", result);
    getAllData();
  }

  return (
    <div className="App">
      <h1>Purebloods</h1>
      {purebloodNames()}
      <button onClick={() => addCharacter()}>
        Click to add another character.
      </button>
      <br />
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <br />
      <button onClick={() => deleteCharacter()}>
        Click to delete character
      </button>

      <br />
      <input type="text" onChange={(e) => setUpdateName(e.target.value)} /> 
      <br />
      <button onClick={() => matchName()}>Modify character</button> 
      <br />

      {isShow === true && (
        <input type="text" onChange={(e) => setNewName(e.target.value)} />
      )}
      <br />
      {isShow === true && <button onClick={() => modifiedName()}>Set new name</button>}

      <br />    
      {isShow === true && <button onClick={() => modifiedStatus()}>Change student status</button>}
      <br /> 
      {isShow === true && (
        <input type="text" onChange={(e) => setAncestry(e.target.value)} />
      )}
      <br />
      {isShow === true && <button onClick={() => newAncestry()}>Set new ancestry</button>}

      <br /> 
      {isShow === true && <button onClick={() => changeGender()}>Assign number to gender</button>}
    </div>
  );
}
// }

export default App;
