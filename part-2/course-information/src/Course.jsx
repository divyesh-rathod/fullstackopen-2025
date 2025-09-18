import React from 'react'

const Header = ({data}) => {
    return <h1>{ data}</h1>
}

const Total = ({data}) => {
let final=0
    final =  data.reduce((initial, next) =>{
     const r = initial + next.exercises;
         return r
    },0 );
    return (
        <>
            <p> total of {final} exercises</p>
        </>
    )
}

const Part = ({ name, exercises }) => {
    return (
      <>
        <p>
          {" "}
          {name} {exercises}
        </p>
      </>
    );
    
}
const Content = ({ data }) => {
    return (
      <>
            {data.map((x) => {
                return <Part name={x.name} exercises={x.exercises} />;
       })}  
      </>
    );
}

const Course = ({ course }) => {
    return (
      <>
            {course.map((course) => {
                return (
                    <>
                <Header data={course.name} />
                <Content data={course.parts} />
                <Total data={course.parts} />
                    </>
            )
        })}
      </>
    );
}

export default Course