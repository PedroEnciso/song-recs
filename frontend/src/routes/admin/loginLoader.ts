export default async function () {
  const response = await fetch("http://localhost:3000/api/admin/login", {
    credentials: "include",
  });
  const url = await response.json();
  window.location.replace(url.url);
  return null;
}
