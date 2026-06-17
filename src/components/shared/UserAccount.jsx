import Link from "next/link";

export const UserAccount = ({ username, isLoading }) => {

    const getTwoChars = () => {
        const words = username.trim().split(/\s+/);

        if(words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }

        return (words[0]).slice(0, 2).toUpperCase();
    }

  return (
    <Link className={`rounded-b-full w-6.25 h-6.25 p-4 justify-center text-center
    text-white font-semibold text-lg ${isLoading ? "bg-gray-500 animate-pulse" : "bg-[#531361]"}`}
    href="/me">
        { getTwoChars(username) }
    </Link>
  )
}
