import { redirect } from "react-router-dom";

export default async function authorizeLoader(
  request: Request
): Promise<Response | string | undefined> {
  const paramString = request.url.split("?")[1];
  const searchParams = new URLSearchParams(paramString);
  if (searchParams.has("code") && searchParams.has("state")) {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const response = await fetch(
      `http://localhost:3000/api/admin/authorize?code=${code}&state=${state}`,
      {
        credentials: "include",
      }
    );
    if (response.status === 204) {
      return redirect("/admin/dashboard");
    } else {
      const data = await response.json();
      return data.error;
    }
    return undefined;
  }
}
