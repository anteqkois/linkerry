'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'
// import { signIn } from "next-auth/react"
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button, Icons, Input, Label, toast } from '@market-connector/ui-components'
import { cn } from '@market-connector/ui-components/lib/utils'
import { userAuthSchema } from '../validations'
// import { Language } from '@market-connector/core'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

type FormData = z.infer<typeof userAuthSchema>

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  // const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    // const signInResult = await signIn("email", {
    //   email: data.email.toLowerCase(),
    //   redirect: false,
    //   callbackUrl: searchParams?.get("from") || "/dashboard",
    // })
    try {
      // const response = AuthApi.signUp({
      //   consents:{
      //     'law': true,
      //   },
      //   email: data.email,
      //   // language: Language.pl,
      //   language: 'Language.pl',
      //   name: data.email,
      //   // password: data.password,
      //   password: 'data.password',

      // })
      const signInResult = { ok: true }
      await new Promise((r) => setTimeout(r, 1500))

      setIsLoading(false)

      if (!signInResult?.ok) throw new Error('Something went wrong')

      return toast({
        title: 'Check your email',
        description: 'We sent you a login link. Be sure to check your spam too.',
      })
    } catch (error) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your sign in request failed. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              // disabled={isLoading || isGitHubLoading}
              disabled={isLoading}
              {...register('email')}
            />
            {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <Button variant="secondary">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      {/* <button
        type="button"
        className={cn(buttonVariants({ variant: 'outline' }))}
        onClick={() => {
          setIsGitHubLoading(true)
          signIn('github')
        }}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{' '}
        Github
      </button> */}
    </div>
  )
}
