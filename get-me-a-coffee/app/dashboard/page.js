"use client"
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Dashboard = () => {

  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  if (!session) {
    return <div>Redirecting...</div>
  }

  return (
    <div>
      Welcome to your dashboard, {session.user.email}!
    </div>
  )
}

export default Dashboard
