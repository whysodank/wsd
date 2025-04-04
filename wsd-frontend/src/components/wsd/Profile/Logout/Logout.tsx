import LogoutButton from '@/components/wsd/LogoutButton'

export async function Logout() {
  return (
    <LogoutButton variant="ghost" className="hover:bg-transparent hover:underline">
      Logout
    </LogoutButton>
  )
}
