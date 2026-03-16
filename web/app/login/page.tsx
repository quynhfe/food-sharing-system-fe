import AuthSidebarVisual from "@/components/auth/AuthSidebarVisual";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <AuthSidebarVisual />

      {/* Right half: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background-light">
        <LoginForm />
      </div>
    </div>
  );
}
