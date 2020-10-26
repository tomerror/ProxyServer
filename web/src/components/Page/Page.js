import React from 'react';
import './Page.css';

const Page = props => {
    return (
        <p className={props.active == props.page ? "link activeLink" : "link"} 
            onClick={() => props.click(props.page)}>
            {props.page}
        </p>
    )
}

export default Page