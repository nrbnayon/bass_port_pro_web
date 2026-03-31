import { SignInForm } from "@/components/Auth/SignInForm";

export const metadata = {
  title: `Admin Signin | ${process.env.NEXT_PUBLIC_APP_NAME} `,
  description: `Secure signin for ${process.env.NEXT_PUBLIC_APP_NAME} administrators.`,
};

export default function AdminSigninPage() {
  return (
    <SignInForm isAdmin={true} />
  );
}
