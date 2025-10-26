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

const PersonForm = ({ persons, setPersons, setNotice }) => {
  const [newName, setNewName] = useState("");
  const [number, setNewNumber] = useState("");

  const handleAddNames = (e) => {
    e.preventDefault();

    const object = { name: newName, number };
    const existing = persons.find((p) => p.name === newName);

    if (existing) {
      if (
        window.confirm(
          `${existing.name} is already added to phonebook. Replace the old number with the new one?`
        )
      ) {
        const updated = { ...existing, number };

        apis
          .UpdateName(updated)
          .then((resp) => {
            // update local list (optional; depends on your API)
            setPersons((prev) =>
              prev.map((p) => (p.id === updated.id ? resp.data : p))
            );
            setNotice({
              type: "success",
              text: `Updated phone number of ${updated.name} to ${updated.number}`,
            });
          })
          .catch((err) => {
            const msg = err.response?.data?.error || "Update failed";
            setNotice({ type: "error", text: msg });
          })
          .finally(() => {
            setTimeout(() => setNotice(null), 5000);
          });
      }
    } else {
      apis
        .Add(object)
        .then((resp) => {
          setPersons((prev) => prev.concat(resp.data));
          setNotice({ type: "success", text: `Added ${object.name}` });
        })
        .catch((err) => {
          const msg = err.response?.data?.error || "Create failed";
          console.log("reached here in catch")
          setNotice({ type: "error", text: msg });
        })
        .finally(() => {
          setTimeout(() => setNotice(null), 5000);
        });
    }

    setNewName("");
    setNewNumber("");
  };

  return (
    <form onSubmit={handleAddNames}>
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        phonenumber:{" "}
        <input value={number} onChange={(e) => setNewNumber(e.target.value)} />
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

const Notification = ({ notice }) => {
  if (!notice) return null; // null, undefined, '' -> nothing

  const { type, text } = notice; // type: 'success' | 'error'
  return (
    <div className={`notification ${type}`} role="status" aria-live="polite">
      {text}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
   const [notice, setNotice] = useState(null); 

  
  useEffect(() => {
    apis.GetAll().then((e) => {
      setPersons(e.data)
    })
      .catch((e) => {
       setNotice({ type: "error", text: "Failed to load people" });
        console.log(e)
    })
    
  },[])

  const [search, setSearch] = useState("")
 
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notice={notice} />

      <Filter search={search} setSearch={setSearch} />

      <br />
      <PersonForm
        setPersons={setPersons}
        persons={persons}
        setNotice={setNotice}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} />
    </div>
  );
};

export default App;
