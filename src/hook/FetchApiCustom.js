import { useCallback } from "react";

const FetchApiCustom = () => {
  const extractDataFromApi = useCallback(async (url) => {
    return await fetch(url).then((res) => res.json());
  }, []);

  return [extractDataFromApi];
};

export default FetchApiCustom;
