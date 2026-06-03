"use client"

import { useQuery } from "@tanstack/react-query"

import Image from 'next/image'
import Link from 'next/link'
import { fetcher, AllLinks } from "../../utils"


export const LinksSection = () => {

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["socialLinks"],
    queryFn: () => fetcher(AllLinks.socialLinks.ALL_SOCIAL_LINKS)
  })

  if(isLoading) return <div>Loading...</div>
  if(isError) return <div>Error: { error.message }</div>

  return (
    <div className="w-full flex justify-start items-start gap-0 h-[20vh]">
        { data?.map((link, _) => (
            <Link href={ link.link } key={ link.id } className="w-[14.8%] h-full pt-[3.5%]" style={{ backgroundColor: link.background_color }}>
                <Image src={ link.image_src } alt={ link.title } width={ 50 } height={ 50 } className="justify-center mx-auto mt-auto align-middle" />
            </Link>
        )) }
    </div>
  )
}
