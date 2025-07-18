import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ShieldCheck } from 'lucide-react';

export const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <ShieldCheck size={48} className="mx-auto text-primary mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800">Vigilance</h1>
                    <p className="text-gray-600">Security Guard Management System</p>
                </div>

                {isLogin ? (
                    <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
                ) : (
                    <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
};