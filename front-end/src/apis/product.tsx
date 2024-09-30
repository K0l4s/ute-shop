export const getBookById = async (id?: String) => {
    const response = await fetch('http://localhost:8080/api/v1/book/'+id, {
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