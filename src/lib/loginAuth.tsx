import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { UserDetails } from "@/utils/types";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuthComponent = (props: P) => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const userDetails = Cookies.get("userDetails");
      if (userDetails) {
        setUser(JSON.parse(userDetails));
      } else {
        router.replace("/login");
      }
      setLoading(false);
    }, [router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (!user) {
      return null; // Prevent rendering the dashboard if the user is not authenticated
    }

    return <WrappedComponent {...props} user={user} />;
  };

  return WithAuthComponent;
};

export default withAuth;
