import AuthLayout from "../components/auth/AuthLayout";
import AuthFlow from "../components/auth/AuthFlow";

export default function LoginPage() {
  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80"
      title="Welcome back"
      subtitle="Log in to continue ordering your favorite meals. Track deliveries, save addresses, and enjoy fast mobile money checkout."
    >
      <AuthFlow mode="login" />
    </AuthLayout>
  );
}
