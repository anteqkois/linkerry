import { zodResolver } from '@hookform/resolvers/zod'
import { isCustomHttpExceptionAxios } from '@linkerry/shared'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  useToast,
} from '@linkerry/ui-components/client'
import { Button } from '@linkerry/ui-components/server'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthApi } from '../api'
import { useUser } from '../useUser'

const FormSchema = z.object({
  code: z.string().min(6, {
    message: 'Your code must be 6 characters.',
  }),
})

export const EmailVerificationDialog = () => {
  const { toast } = useToast()
  const { emialVerificationDialog, setEmailVerificationDialog, user, setUser } = useUser()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      const { data } = await AuthApi.verifyEmailCode(formData.code)

      toast({
        title: 'Your emial is verified !',
        variant: 'success',
        duration: 5_000,
      })
      setUser((user) => ({ ...user, emailVerifiedAtDate: data.emailVerifiedAtDate }))
      setEmailVerificationDialog(false)
    } catch (error) {
      if (isCustomHttpExceptionAxios(error))
        form.setError('code', {
          message: error.response.data.message,
        })
    }
  }

  const onCloseDialog = useCallback((newState: boolean) => {
    if (!user.emailVerifiedAtDate)
      return form.setError('code', {
        message: 'you need to verify your email so we can know it belongs to you.',
      })
    setEmailVerificationDialog(newState)
  }, [])

  const onResendCode = useCallback(async () => {
    try {
      await AuthApi.resendEmailCode()

      toast({
        title: 'We send you a new code. Please check your email inbox and type the code here.',
        variant: 'success',
        duration: 8_000,
      })
    } catch (error) {
      let errorMessage = 'We can not send you a new verification Code. Please concact with our Team.'
      if (isCustomHttpExceptionAxios(error)) errorMessage = error.response.data.message

      toast({
        title: 'Resend code failed',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }, [])

  return (
    <Dialog open={emialVerificationDialog} onOpenChange={onCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dear Linkerry user, please confirm your email address 📧</DialogTitle>
          <DialogDescription>
            We need to confirm your email so that we can send you information about your flow, usage, subscription and stay in touch.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex-center flex-col">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email code </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                      <InputOTPGroup>
                        {new Array(6).fill(1).map((_, index) => (
                          <InputOTPSlot key={index} index={index} className="h-16 w-16 text-3xl" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    <span className="block">Please enter the code you receive in email.</span>
                    <span className="block">
                      Didn&apos;t receive email ?{' '}
                      <span className="hover:text-brand underline underline-offset-4 hover:cursor-pointer" onClick={onResendCode}>
                        Send code again.
                      </span>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
