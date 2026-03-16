import AuthSidebarVisual from "@/components/auth/AuthSidebarVisual";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AuthSidebarVisual />

      {/* Right half: Register Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12 md:p-20 bg-white">
        <RegisterForm />
      </div>
    </div>
  );
}
