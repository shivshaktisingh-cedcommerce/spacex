import { useCallback } from "react";

const FetchApiCustom=()=>{
  const extractDataFromApi = useCallback(async(url , payload)=>{ 
      return await fetch(url , payload).then((res)=>res.json())
  },[])
 
  return [extractDataFromApi];
};

export default FetchApiCustom;