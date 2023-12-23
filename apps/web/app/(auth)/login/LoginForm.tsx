'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Input, Label } from '@market-connector/ui-components/client'
import { Button, Icons } from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '../../../modules/user/useUser'
import { retriveServerHttpException } from '../../../shared/utils'
import { userAuthSchema } from '../validations'

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

type FormData = z.infer<typeof userAuthSchema>

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const { push } = useRouter()
  const { get } = useSearchParams()
  const { login } = useUser()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  // const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      const loginResult = await login(data)

      if (loginResult.error) throw new Error('Something get wrong')

      setIsLoading(false)
      const from = get('from')
      if (from) return push(from)
      push('/app/dashboard')
    } catch (error: any) {
      setIsLoading(false)
      const serverError = retriveServerHttpException(error)
      if (serverError) return setError('root', { message: serverError.message, type: 'manual' })
      console.log(error)
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
            <Input
              id="password"
              placeholder="*********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              // disabled={isLoading || isGitHubLoading}
              disabled={isLoading}
              {...register('password')}
            />
            <div className="h-3">
              {errors?.password && <p className="px-1 text-xs text-red-600">{errors.password.message}</p>}
              {errors?.root && <p className="px-1 text-xs text-red-600">{errors.root.message}</p>}
            </div>
          </div>
          <Button>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Login with Email
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
