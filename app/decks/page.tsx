import { getSaved } from "../../actions/saved";
import { getUser } from "../../actions/auth";
import ErrorPage from "../../components/error-page";
import AddDeck from "../../components/add-deck";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    return <ErrorPage title={401}>Unauthorized</ErrorPage>;
  }
  const savedWordsQuery = await getSaved(0, user?.username);
  return <AddDeck words={savedWordsQuery.rows} />;
}
