// lib/mazeApi.js
export async function fetchShowDetails(id) {
    const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch show details');
    }
    return res.json();
  }
  
  export async function fetchCast(id) {
    const res = await fetch(`https://api.tvmaze.com/shows/${id}/cast`);
    if (!res.ok) {
      throw new Error('Failed to fetch cast details');
    }
    return res.json();
  }  