'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Language } from '@linkerry/shared'
import { ButtonClient, Input, Label } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useUser } from '../../../modules/user/useUser'
import { retriveServerHttpException } from '../../../shared/utils'
import { userAuthSchema } from '../validations'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

type FormData = z.infer<typeof userAuthSchema>

export function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const { signUp } = useUser()
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState(false)
  // const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      const signUpResponse = await signUp({
        consents: {
          law: true,
        },
        email: data.email,
        language: Language.pl,
        name: data.email,
        password: data.password,
      })

      if (signUpResponse.error) throw new Error('Something went wrong')

      // toast({
      //   title: 'Check your email',
      //   description: 'We sent you a login link. Be sure to check your spam too.',
      // })

      setIsLoading(false)
      push('/app/dashboard')
    } catch (error) {
      setIsLoading(false)
      const serverError = retriveServerHttpException(error)
      if (serverError) return setError('root', { message: serverError.message, type: 'manual' })
      console.error(error)
      return setError('root', { message: 'Your sign in request failed. Please try again.', type: 'manual' })
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
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="*********"
                type={showPassword ? 'text' : 'password'}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                // disabled={isLoading || isGitHubLoading}
                disabled={isLoading}
                className="pr-8"
                {...register('password')}
              />
              {showPassword ? (
                <Icons.Hide className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(false)} />
              ) : (
                <Icons.Show className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(true)} />
              )}
            </div>
            <div className="h-3">
              {errors?.password && <p className="px-1 text-xs text-red-600">{errors.password.message}</p>}
              {errors?.root && <p className="px-1 text-xs text-red-600">{errors.root.message}</p>}
            </div>
          </div>
          <ButtonClient loading={isLoading}>Sign In with Email</ButtonClient>
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
