import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

export async function Details() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Account Details</h2>
      <div className="flex flex-col gap-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" defaultValue="Işık" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" defaultValue="Kaplan" />
      </div>
      <Button className="w-full">Save Changes</Button>
    </div>
  )
}
