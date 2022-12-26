/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { launchApi } from "../api/AllApi";
import CardComponent from "./CardComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";
import axios from "axios";

let startedIntersecting = true;
export default function Home() {
  const navigate = useNavigate();
  const observer = useRef();
  const totalElements = useRef();
  let [searchParams, setSearchParams] = useSearchParams();
  let params1 = new URLSearchParams(document.location.search);
  let sort = params1.get("order");
  if (sort !== "asc" && sort !== "desc") {
    let params = { order: "asc" };
    sort = "asc";
    setSearchParams(params);
  }
  const [order, setOrder] = useState(sort);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);
  const handleNewPage = (item) => {
    navigate(`/details/${item.id}`);
  };
  const lastCardElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !startedIntersecting) {
          if (offset <= totalElements.current) {
            let tempOffset = offset + 9;
            setOffset(tempOffset);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    setTimeout(() => {
      startedIntersecting = false;
    }, 1500);
  }, []);

  const handleChange = (e) => {
    setOrder(e.target.value);
  };

  const handleClick = useCallback(() => {
    setloading(true);
    let temp = [];
    let params = { order: order };
    setSearchParams(params);
    let url = launchApi + `?order=${order}&offset=0&limit=9`;
    axios(url).then((res) => {
      res.data.map((item) => {
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
      console.log(data)
    });
  }, [order]);
  useEffect(() => {
    axios(launchApi).then((res) => {
      totalElements.current = res.data.length;
    });
  }, []);

  useEffect(() => {
    setloading(true);
    setError(false);
    let temp = [...data];
    let cancel;
    let url = launchApi + `?order=${order}&offset=${offset}&limit=9`;
    axios({ url: url, cancelToken: new axios.CancelToken((c) => (cancel = c)) })
      .then((res) => {
        res.data.map((item) => {
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
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [offset]);
  console.log(offset);
  return (
    <div>
      <div className="uppersection">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={order}
          label="Sort by"
          onChange={handleChange}
        >
          <MenuItem value={"desc"}>desc</MenuItem>
          <MenuItem value={"asc"}>asc</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleClick}>
          {loading ? <CircularProgress color="inherit" /> : "Submit"}
        </Button>
      </div>
      <p>Total results:{data.length}</p>
      <div className="all_repetitive_card_container">
        {data.map((item, index) => {
          if (data.length === index + 1) {
            return (
              <div
                key={item.id}
                className="single_card"
                ref={lastCardElementRef}
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
          } else {
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
          }
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 5 }}>
        {loading && totalElements.current >= data.length && (
          <CircularProgress color="primary" />
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 5 }}>
        {error && "Error..."}
      </div>
    </div>
  );
}
