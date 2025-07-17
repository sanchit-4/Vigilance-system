import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Label } from '../shared/Label';
import { LogIn, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
    onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { error } = await signIn(email, password);
        
        if (error) {
            setError(error.message);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <LogIn size={32} className="mx-auto text-primary mb-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
                    <p className="text-gray-600">Access your Vigilance account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="text-primary hover:text-primary-hover font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-md text-xs text-gray-600">
                    <p className="font-medium mb-2">Demo Accounts:</p>
                    <p>Admin: admin@vigilance.com / admin123</p>
                    <p>Supervisor: supervisor@vigilance.com / super123</p>
                    <p>Guard: guard@vigilance.com / guard123</p>
                </div>
            </div>
        </div>
    );
};