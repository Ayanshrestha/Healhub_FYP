import PublicLayout from "../layouts/PublicLayout";
import Login from "../features/auth/Login";

export default function LoginPage() {
  return (
    <PublicLayout>
      <Login />
    </PublicLayout>
  );
}
