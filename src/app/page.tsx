import { auth } from "@/auth";
import Profile from "@/components/Profile";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <main>
        <Profile />
      </main>
    </>
  );
}
