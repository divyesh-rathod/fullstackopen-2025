import { useState } from "react";

const Most_voted = ({ anecdotes, indx }) => {

  return <p> {anecdotes[indx]}</p>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  });

  const [indx, setindx] = useState(0);
  const [cntvts, setCntvts] = useState(0);

  const HandleClick = () => {
    const num = Math.floor(Math.random() * 8);
    setSelected(num);
  }
  const HandleClickVote = () => {
   
    const updatedVote = {
      ...votes,
      [selected]:votes[selected]+1
    }
    console.log(updatedVote);
    setVotes(updatedVote)
    for (const pos in updatedVote) {
      console.log(votes[pos], "  ", pos);
      if (updatedVote[Number(pos)] > cntvts) {
        console.log("reached here");
        console.log(cntvts, "this is maxi inside");
        setindx(Number(pos));
        setCntvts(updatedVote[Number(pos)]);
        console.log(cntvts, "this is pos inside after update");
        console.log(indx, "this is maxi  after update inside");
      }
    }
    

  }

  return (
    <>
      <div>{anecdotes[selected]}</div>
      <p> has {votes[selected]} votes </p>
      <button onClick={HandleClickVote}>Vote</button>
      <button onClick={HandleClick}> next anecdotes</button>
      <h1> The anecdotes with most number of votes is </h1>
      <Most_voted anecdotes={anecdotes} indx={indx} />
      <p> has {cntvts} votes</p>
    </>
  );
};

export default App;
