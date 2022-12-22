/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */

import React, { useEffect, useRef, useState } from "react";
import { launchApi } from "../api/AllApi";
import FetchApiCustom from "../hook/FetchApiCustom";
import CardComponent from "./CardComponent";
import DropdownComponent from "./DropdownComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export default function Home() {
  let [searchParams, setSearchParams] = useSearchParams();
  let params1 = new URLSearchParams(document.location.search);
  let sort = params1.get("order")
  if(sort!=='asc' && sort!=='desc'){
    let params = {order:'asc'};
    sort = 'asc';
    setSearchParams(params);
  }
  console.log(sort)
  const scrolltop = useRef();
  scrolltop.current = 300;
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const interval = useRef();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState(sort);
  const limit = 9;
  const [loading, setloading] = useState(false);
  const [extractDataFromApi] = FetchApiCustom();


  const handleNewPage = (item) => {
    navigate(`/details/${item.id}`);
  };

  const onScroll = () => {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight
    ) {
      scrolltop.current = scrolltop.current + 300;
      clearTimeout(interval.current);
      interval.current = setTimeout(() => {
        let tempOffset = offset + 9;
        setOffset(tempOffset);
        let temp = [...data];
        let url =
          launchApi + `?order=${order}&offset=${tempOffset}&limit=${limit}`;
        setloading(true);
        extractDataFromApi(url).then((res) => {
          res.map((item) => {
            let obj = {
              id: item.flight_number,
              image: item.links.mission_patch,
              title: item.mission_name,
              siteid: item.launch_site.site_id,
              details: item.details,
              launchdate: item.launch_date_utc,
            };
            temp.push(obj);
          });
          setData(temp);
          setloading(false);
        });
      }, 1000);
    }
  };
  window.addEventListener("scroll", onScroll);

  useEffect(() => {
    let params = {order: order===null?'desc':order};
    setSearchParams(params);
    let temp = [];
    let url = launchApi + `?order=${order}&offset=${offset}&limit=${limit}`;
    setloading(true);
    extractDataFromApi(url).then((res) => {
      if (res.length > 0) {
        setloading(true);
      }
      res.map((item) => {
        let obj = {
          id: item.flight_number,
          image: item.links.mission_patch,
          title: item.mission_name,
          siteid: item.launch_site.site_id,
          details: item.details,
          launchdate: item.launch_date_utc,
        };
        temp.push(obj);
      });
      setData(temp);
      setloading(false);
    });
  }, [order]);

  return (
    <div>
      <DropdownComponent order={order} setOrder={setOrder} loading={loading} />
      <p>Total results:{offset + 9}</p>
      <div className="all_repetitive_card_container">
        {data.map((item) => {
          return (
            <div
              className="single_card"
              key={item.id}
              onClick={() => handleNewPage(item)}
            >
              <CardComponent
                image={item.image}
                details={item.details}
                date={item.launchdate}
                title={item.title}
                sites={item.siteid}
              />
            </div>
          );
        })}   
      </div>
      {loading ? <CircularProgress color="inherit" /> : ""}
    </div>
  );
}
