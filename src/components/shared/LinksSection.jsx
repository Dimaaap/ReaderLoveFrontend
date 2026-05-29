import Image from 'next/image'
import Link from 'next/link'
import { socialLinks } from '../../../config'

export const LinksSection = () => {
  return (
    <div className="w-full flex justify-start items-start gap-0 h-[20vh]">
        { socialLinks.map((link, index) => (
            <Link href={ link.link } key={ index } className="w-[14.8%] h-full pt-[3.5%]" style={{ backgroundColor: link.bgColor }}>
                <Image src={ link.imageSrc } alt={ link.alt } width={ 50 } height={ 50 } className="justify-center mx-auto mt-auto align-middle" />
            </Link>
        )) }
    </div>
  )
}
