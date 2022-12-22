

const FetchApiCustom = () => {
  const extractDataFromApi = (url) => {
    return fetch(url).then((res) => res.json());
  }

  return [extractDataFromApi];
};

export default FetchApiCustom;
