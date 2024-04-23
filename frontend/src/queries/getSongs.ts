export async function getSongs(query: string) {
  const response = await fetch(`http://localhost:3000/api/songs?song=${query}`);
  if (!response.ok) {
    throw new Error("Caught this error");
  }
  return response.json();
}
