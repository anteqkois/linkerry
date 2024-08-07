import { H3, Icons, buttonVariants } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import Link from 'next/link'
import { SignUpForm } from './SignupForm'

export const metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
}

export default function RegisterPage() {
  return (
    // <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
    //   <Link
    //     href="/login"
    //     className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
    //   >
    //     Login
    //   </Link>
    //   <div className="hidden h-full bg-muted lg:block" />
    //   <div className="lg:p-8">
    //     <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
    //       <div className="flex flex-col space-y-2 text-center">
    //         <Icons.Logo className="mx-auto h-6 w-6" />
    //         <H3>Create an account</H3>
    //         <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
    //       </div>
    //       <SignUpForm />
    //       <p className="px-8 text-center text-sm text-muted-foreground">
    //         By clicking continue, you agree to our{' '}
    //         <Link href="/terms" className="hover:text-brand underline underline-offset-4">
    //           Terms of Service
    //         </Link>{' '}
    //         and{' '}
    //         <Link href="/privacy" className="hover:text-brand underline underline-offset-4">
    //           Privacy Policy
    //         </Link>
    //         .
    //       </p>
    //     </div>
    //   </div>
    // </div>

    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}>
        Login
      </Link>
      <div className="mb-14">
        <Icons.LogoWhole className="mx-auto h-16 w-80 md:h-20 md:w-160" />
        <p className="text-center">Automating Tomorrow&apos;s Success with AI</p>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <H3>Create an account</H3>
          <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
        </div>
        <SignUpForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link href="/docs/linkerry_regulamin_treści_cyfrowe.pdf" target="_blank" className="hover:text-brand underline underline-offset-4">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/docs/linkerry_polityka_prywatności.pdf" target="_blank" className="hover:text-brand underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
