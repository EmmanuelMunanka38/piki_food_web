import AuthLayout from "../components/auth/AuthLayout";
import AuthFlow from "../components/auth/AuthFlow";

export default function SignUpPage() {
  return (
    <AuthLayout
      image="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80"
      title="Join PikiFood today"
      subtitle="Order from hundreds of restaurants across Tanzania and Kenya. Fast delivery, secure mobile money payments, and real-time tracking."
    >
      <AuthFlow mode="signup" />
    </AuthLayout>
  );
}
