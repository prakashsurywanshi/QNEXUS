import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';
import { useRef } from 'react';

type DemoUser = {
    name: string;
    email: string;
    role: string;
    society: string;
};

type Props = {
    status?: string;
    canResetPassword: boolean;
    demoUsers: DemoUser[];
    demoPassword: string;
};

export default function Login({
    status,
    canResetPassword,
    demoUsers,
    demoPassword,
}: Props) {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Log in" />

            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors, submit, clearErrors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    ref={emailRef}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    ref={passwordRef}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Sign up
                            </TextLink>
                        </div>

                        {demoUsers.length > 0 && (
                            <div className="grid gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-border h-px flex-1" />
                                    <span className="text-muted-foreground text-xs font-medium uppercase">
                                        Demo accounts
                                    </span>
                                    <div className="bg-border h-px flex-1" />
                                </div>

                                <p className="text-muted-foreground text-center text-xs">
                                    Click a demo account to log in instantly
                                </p>

                                <div className="max-h-64 overflow-y-auto rounded-md border">
                                    {demoUsers.map((user) => (
                                        <button
                                            key={user.email}
                                            type="button"
                                            onClick={() => {
                                                if (emailRef.current) {
                                                    emailRef.current.value =
                                                        user.email;
                                                }
                                                if (passwordRef.current) {
                                                    passwordRef.current.value =
                                                        demoPassword;
                                                }
                                                clearErrors();
                                                submit();
                                            }}
                                            className="hover:bg-muted/50 flex w-full items-center justify-between gap-2 border-b bg-transparent px-3 py-2 text-left text-sm last:border-b-0"
                                        >
                                            <span className="min-w-0">
                                                <span className="block truncate font-medium">
                                                    {user.name}
                                                </span>
                                                <span className="text-muted-foreground block truncate text-xs">
                                                    {user.email}
                                                </span>
                                            </span>
                                            <span className="flex shrink-0 flex-col items-end gap-0.5">
                                                <span className="bg-secondary rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                                                    {user.role}
                                                </span>
                                                <span className="text-muted-foreground text-[10px]">
                                                    {user.society}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
