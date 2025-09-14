import { useState } from "react";

const StatisticLine = ({ text, value }) => {
  //console.log(text,value)
  if (text === "avg") {
    return (
      <>
        <td>
          {text}
        </td>
        <td>
          {value} %
        </td>
           
        
      </>
    );
  }
    return (
      <>
        <td>{text}</td>
        <td>{value} </td>
      </>
    );
}

const Statistics = ({ good, bad, neutral }) => {
  if (good === 0 && bad === 0 && neutral === 0) {

    return (
      <>
        <h1>Stats</h1>
        
        <table>
          <thead>
            <tr>
              <td> <p> No feedback given. </p> </td>
            </tr>
          </thead>
          
          
        </table>
      </>
    )
  }
  return (
    <>
      <h2>Stats</h2>
      <table>
        <thead>
          <tr>
            <StatisticLine text={"good"} value={good} />
          </tr>
        </thead>
        <thead>
          <tr>
            <StatisticLine text={"Neutral"} value={neutral} />
          </tr>
        </thead>
        <thead><tr>
          <StatisticLine text={"bad"} value={bad} />
        </tr></thead>
        <thead><tr>
          <StatisticLine text={"all"} value={good + bad + neutral} />
        </tr></thead>
        <thead><tr>
          <StatisticLine text={"avg"} value={(good - bad) / 3} />
        </tr></thead>
        <thead><tr>
          <StatisticLine
            text={"Positive"}
            value={(good / (good + bad + neutral)) * 100}
          />
        </tr></thead>
        
        
        
        
      </table>
    </>
  );
};

const Button = ({ onClick, text }) => {
   return <button onClick={onClick}> { text } </button>
}

const App = () => {
  
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const handleClickGood = () => {
     setGood(good+1)
  }
  const handleClickNeutral = () => {
    setNeutral(neutral + 1);
  };
  const handleClickBad = () => {
    setBad(bad + 1);
  };

  return (
    <>
      <h1> Give Feed Back</h1>
      <Button onClick={handleClickGood} text={"Good"} />
      <Button onClick={handleClickNeutral} text={"Neutral"} />
      <Button onClick={handleClickBad} text={"Bad"} />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </>
  );
  
};

export default App;
