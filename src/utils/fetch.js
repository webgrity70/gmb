export async function authenticatedGet(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
  if (response.status === 200) return response.json();
  throw await response.json();
}

export async function authenticatedPost(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  if (response.status === 200) return response.json();
  throw await response.json();
}
