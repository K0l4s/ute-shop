import { BASE_URL } from "./base";

export const getBookById = async (id?: String) => {
    const response = await fetch(BASE_URL + '/book/'+id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    // const data = await response.json();
    // console.log('Data:', data);
    return response;
}