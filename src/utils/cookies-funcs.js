"use server"

import { cookies } from "next/headers"


export const setCookie = async (cookieName, value, settings=null) => {
    const cookiesStore = await cookies()

    cookiesStore.set(cookieName, value, settings)
}

export const getCookie = async (cookieName) => {
    const cookiesStore = await cookies()
    const value = cookiesStore.get(cookieName)?.value

    return value
}