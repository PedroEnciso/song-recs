import { useRouteError, isRouteErrorResponse } from "react-router-dom";
function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {isRouteErrorResponse(error)
            ? error.statusText || error.data
            : "An unknown error occured"}
        </i>
      </p>
    </div>
  );
}

export default ErrorPage;
