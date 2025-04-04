import { CompleteSignupForm } from '@/components/wsd/Profile/CompleteSignup/client'

export async function CompleteSignup() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h2 className="text-2xl font-bold">Complete Signup</h2>
        <p className="text-muted-foreground text-md">Fill the form below to complete your profile</p>
      </div>
      <div className="flex flex-col gap-4">
        <CompleteSignupForm />
      </div>
    </div>
  )
}
