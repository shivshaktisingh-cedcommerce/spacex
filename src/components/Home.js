/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */

import React, { useEffect, useRef, useState } from 'react'
import { launchApi} from '../api/AllApi'
import FetchApiCustom from '../hook/FetchApiCustom'
import CardComponent from './CardComponent'
import DropdownComponent from './DropdownComponent'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

export default function Home() {

    const navigate= useNavigate();
    const[offset , setOffset]=useState(0)
    const interval = useRef();
    const [data , setData]=useState([])
    const [order , setOrder]=useState(sessionStorage.getItem('order') || 'desc')
    const[limit , setLimit]=useState(9)
    const[loading , setloading]=useState(false)
    let [searchParams, setSearchParams] = useSearchParams();
    const [extractDataFromApi] = FetchApiCustom()

    const handleNewPage=(item)=>{
      navigate(`/details/${item.id}`)       
    }

    const onScroll = () => {
      if((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 700)){
        clearTimeout(interval.current)
        interval.current = setTimeout(()=>{
          let tempOffset = limit;
          setOffset(limit)
          let temp=[...data]
          let url = launchApi + `?order=${order}&offset=${tempOffset}&limit=${limit}`
          setloading(true)
          extractDataFromApi(url).then((res)=>{
            res.map((item)=>{
              let obj = {id:item.flight_number ,image:item.links.mission_patch , title:item.mission_name ,siteid:item.launch_site.site_id, details:item.details , launchdate:item.launch_date_utc}
              temp.push(obj)
            })
            setData(temp)
            setloading(false)
          })
        },500) 
      }
    }
    window.addEventListener('scroll', onScroll);

    useEffect(()=>{  
      let temp=[]
      let params = {order:order};
      setSearchParams(params);
      let url = launchApi + `?order=${order}&offset=0&limit=${limit}`
      setloading(true)
      extractDataFromApi(url).then((res)=>{
        if(res.length>0){
          setloading(!loading)
        }
        res.map((item)=>{
          let obj = {id:item.flight_number ,image:item.links.mission_patch , title:item.mission_name ,siteid:item.launch_site.site_id, details:item.details , launchdate:item.launch_date_utc}
          temp.push(obj)
        })
        setData(temp)
        setloading(false)
      })
    },[order])

  return (
    <div>
      <DropdownComponent order={order} setOrder={setOrder} loading={loading} />
      <p>Total results:{data.length}</p>
      <div className="all_repetitive_card_container">
        {data.map((item)=>{
          return (
            <div className="single_card"  key ={uuidv4()} onClick={()=>handleNewPage(item)}>
              <CardComponent image={item.image} details={item.details} date={item.launchdate} title={item.title} sites={item.siteid}/>
            </div>
              )
        })}
      {loading?<CircularProgress color="inherit" />:""}
      </div>
    </div>
  )
}
