import { useState, useEffect } from "react";
import apis from "./services/persons.js"
import "./app.css"

const Filter = ({ search, setSearch }) => {
  return (
    <div>
      search :{""}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

const PersonForm = ({ persons,setErrorMessage }) => {
  const [newName, setNewName] = useState("");
  const [number, setNewNumber] = useState("");
  

  const handleAddNames = (e) => {
    e.preventDefault();
    const object = {
      name: newName,
      number,
    };
    let ifpresent = persons.find((name) => name.name === newName);
    if (ifpresent) {
      let currentPerson = persons.find((name) => name.name === newName);
      console.log(currentPerson.name)
      if (
        window.confirm(
          `${currentPerson.name} is already added to phone book replace the old number with the new one ?`
        )
      ) {
        apis
          .UpdateName(currentPerson)
          .then((e) => {
            setErrorMessage(
              `Updated Phone number of ${object.name} to ${object.number}`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        alert(`Phone number is not updated`);
      }
    }
    else {
      apis.Add(object)
        .then((e) => {
           setErrorMessage(
             `Added ${object.name}`
           );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
        })
        .catch((e) => { console.log(e) });
    }
    
    setNewName("");
    setNewNumber("");
  };
  return (
    <form onSubmit={handleAddNames}>
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />
      </div>
      <div>
        phonenumber:{" "}
        <input
          value={number}
          onChange={(e) => {
            setNewNumber(e.target.value);
          }}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, search, }) => {
  const visible = persons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = (data) => {
    if (window.confirm(`Delete ${data.name}`)) {
      apis.DeleteProduct(data.id).catch((e)=>{console.log(e)})
    }
    else {
      alert(`User ${data.name} is safe and not delted`)
   }
  }
  return (
    <div>
      {search === "" ? (
        persons.map((e) => {
          return (
            <li key={e.id}>
              {" "}
              {e.name} {e.number} {" "}
              <button
              onClick={()=>handleDelete(e)}
              > Delete</button>
            </li>
            
          );
        })
      ) : (
        <>
          {visible.map((e) => {
            return (
              <li key={e.id}>
                {" "}
                {e.name} {e.number}
              </li>
            );
          })}{" "}
        </>
      )}
    </div>
  );
    
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  
  useEffect(() => {
    apis.GetAll().then((e) => {
      setPersons(e.data)
    })
      .catch((e) => {
        console.log(e)
    })
    
  },[])

  const [search, setSearch] = useState("")
 
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />

      <Filter search={search} setSearch={setSearch} />

      <br />
      <PersonForm setPersons={setPersons} persons={persons} setErrorMessage={setErrorMessage} />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} />
    </div>
  );
};

export default App;
