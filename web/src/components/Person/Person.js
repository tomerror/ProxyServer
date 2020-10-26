import React from 'react';
import './Person.css';

const Person = props => {
    return (
        <div className="person">
            <img className="avatar" src={props.person.avatar} />
            <div className="name">{props.person.first_name} {props.person.last_name}</div>
            <div className="email">{props.person.email}</div>
        </div>
    )
}

export default Person