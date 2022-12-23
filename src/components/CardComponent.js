import React from 'react'
import { defaultImagePath } from '../defaultImagepath/DefaultImagePath'

export default function CardComponent(props) {
    
    
  return (
    <div className="card">
        <div>
            <img src={props.image===null?defaultImagePath:props.image} alt="spaceX"/>
        </div>
        <h2>{props.title}</h2>
        <p>{typeof props.details==="string" && props.details.length>40?props.details.slice(0 , 40)+ "...":props.details }</p>
        
        {/* <div className="dateandsite"><span>{props.date.slice(0 , 10)}</span><span>{props.sites}</span></div> */}

    </div>
  )
}
