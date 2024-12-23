import { LogoutButton } from '@/components/wsd/Profile/Logout/client'

export async function Logout() {
  return (
    <LogoutButton variant="ghost" className="hover:bg-transparent hover:underline">
      Logout
    </LogoutButton>
  )
}
