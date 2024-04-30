import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "src/queries/getRecommendations";

function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
  });

  if (isLoading) {
    return <p>Getting your recommendations</p>;
  }

  if (error) {
    console.log(error);
    return <p>Sorry, there was an error: {error.message}</p>;
  }

  return (
    <ul>
      {data?.map((recommendation) => (
        <li key={recommendation.id}>
          <p>{recommendation.song.name}</p>
          <p>Recommended by {recommendation.recommender}</p>
        </li>
      ))}
    </ul>
  );
}

export default AdminDashboard;
