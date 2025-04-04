import { Button } from '@/components/shadcn/button'
import { LogoutButton as ClientLogoutButton } from '@/components/wsd/LogoutButton/client'

export function LogoutButton(props: Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'>) {
  const { children, ...buttonProps } = props
  return <ClientLogoutButton {...buttonProps}>{children}</ClientLogoutButton>
}
