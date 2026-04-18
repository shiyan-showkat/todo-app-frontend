function HomeRedirect() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data?.loggedIn) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading)
    return (
      <div className="text-white h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return auth ? (
    <Navigate to="/todos" replace />
  ) : (
    <Navigate to="/signup" replace />
  );
}
