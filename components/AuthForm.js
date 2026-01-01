import Image from "next/image";
import googleLogo from "@/public/google.svg";
import facebookLogo from "@/public/facebook.svg";
import appleLogo from "@/public/apple.svg";
import Link from "next/link";

export default function AuthForm({
  title,
  subtitle,
  buttonText,
  children,
  footerText,
  footerLinkText,
  footerLink,
  handleSubmit,
  loading,
}) {
  return (
    <section className="flex bg-[#2A5BC0] ">
      <div className="flex w-full min-h-screen items-center bg-background justify-center md:rounded-bl-[5vw] md:rounded-tr-none rounded-bl-[20vw] rounded-tr-[20vw]">
        <div className="flex w-3/4 min-h-screen flex-col items-center justify-center gap-5">
          <div className="flex flex-col  md:items-start items-center gap-2 ">
            <h1 className="mb-5 text-4xl font-bold text-primary">Logo</h1>
            <h2 className="md:block hidden text-3xl font-bold text-foreground">
              {title}
            </h2>
            <p className=" text-text">{subtitle}</p>

            <form className="flex flex-col gap-5 mt-4">
              {children}
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="cursor-pointer bg-primary p-3 rounded-md text-md font-semibold text-background"
              >
                {loading ? "Creating account..." : buttonText}
              </button>
            </form>
          </div>
          <p className="self-center text-text">or</p>
          <div className="flex gap-7">
            <Image
              className="cursor-pointer"
              width={30}
              src={googleLogo}
              alt="google logo"
            />
            <Image
              className="cursor-pointer"
              width={35}
              src={facebookLogo}
              alt="facebook logo"
            />
            <Image
              className="cursor-pointer dark:invert"
              width={35}
              src={appleLogo}
              alt="apple logo"
            />
          </div>
          <p className="self-center text-text relative top-15">
            {footerText}
            <Link
              href={footerLink}
              className="cursor-pointer font-semibold text-primary underline"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
