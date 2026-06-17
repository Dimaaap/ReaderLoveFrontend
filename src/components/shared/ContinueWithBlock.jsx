import { ContinueWithBtn } from './ContinueWithBtn'
import Image from 'next/image'
import { AllLinks } from '@/utils'
import { useAuth } from '@/hooks/useAuth'

export const ContinueWithBlock = () => {

  const { isAuthenticated } = useAuth();

  const handleGoogleLogin = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
      redirect_uri: AllLinks.users.LOGIN_WITH_GOOGLE,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const qs = new URLSearchParams(options).toString();

    window.location.href = `${rootUrl}?${qs}`
  }

  const handleGitHubLogin = () => {
    const rootUrl = "https://github.com/login/oauth/authorize";

    const options = {
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      redirect_uri: AllLinks.users.LOGTIN_WITH_GITHUB,
      scope: "user:email"
    }

    const qs = new URLSearchParams(options).toString();
    window.location.href = `${rootUrl}?${qs}`
  }

  return (
    <div className="flex items-center w-full justify-center gap-7">
        <ContinueWithBtn 
        icon={ <Image src="/icons/google.svg" width={20} height={ 20 } alt="Google" /> } 
        text="Google"
        clickHandler={ handleGoogleLogin } />
        <ContinueWithBtn icon={ <Image src="/icons/github.svg" width={20} height={ 20 } alt="GitHub" /> } text="GitHub"
        clickHandler={ handleGitHubLogin } />
    </div>
  )
}