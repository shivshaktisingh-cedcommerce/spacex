/* eslint-disable react-hooks/exhaustive-deps */
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { launchApi } from "../api/AllApi";
import { defaultImagePath } from "../defaultImagepath/DefaultImagePath";
import FetchApiCustom from "../hook/FetchApiCustom";

export default function OneItem() {
  const [extractDataFromApi] = FetchApiCustom();
  const [res, setRes] = useState({});
  const { id } = useParams();

  useEffect(() => {
    let url = launchApi + `/${id}`;
    extractDataFromApi(url).then((res) => {
      setRes(res);
    });
  }, []);

  return (
    <>
      <div className="card1">
        {Object.keys(res).length > 0 ? (
          <div>
            <div>
              <img
                src={
                  res.image === null
                    ? defaultImagePath
                    : res.links.mission_patch
                }
                alt="spaceX"
              />
            </div>
            <h2>{res.title}</h2>
            <p>{typeof res.details === "string" ? res.details : ""}</p>
            <div className="dateandsite">
              <span>{res.launch_date_local.slice(0, 10)}</span>
              <span>{res.launch_site.site_id}</span>
            </div>
          </div>
        ) : (
          <CircularProgress color="inherit" />
        )}
      </div>
    </>
  );
}
