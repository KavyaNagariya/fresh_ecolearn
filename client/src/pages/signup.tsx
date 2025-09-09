import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Button } from "../components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !successMessage) {
      setLocation('/dashboard');
    }
  }, [user, setLocation, successMessage]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // For email/password signup: sign out and show success message
      await signOut(auth);
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      setSuccessMessage("Account created successfully! Please sign in to continue.");
      
      // Redirect to sign-in after 3 seconds
      setTimeout(() => {
        setLocation('/signin');
      }, 3000);
      
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // For Google signup: stay signed in, auth context will handle navigation
      console.log('Google sign in successful, auth context will handle navigation');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show success message screen
  if (successMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-4">{successMessage}</p>
            <p className="text-sm text-gray-500">Redirecting to sign in page...</p>
          </div>
          <Button 
            onClick={() => setLocation('/signin')}
            className="bg-green-600 hover:bg-green-700"
          >
            Go to Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-green-700">Sign Up for EcoLearn</h2>
        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded border px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full rounded border px-3 py-2"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
          <Button 
            type="submit" 
            className="w-full bg-green-600 text-white hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up with Email'}
          </Button>
        </form>
        <div className="my-4 text-center text-gray-500">or</div>
        <Button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 font-semibold py-2 rounded shadow transition-all duration-200"
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {loading ? 'Signing In...' : 'Sign In with Google'}
        </Button>
        
        {error && <div className="mt-4 text-red-600">{error}</div>}
        
        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={() => setLocation('/signin')}
            className="text-green-600 hover:text-green-700 font-medium"
            disabled={loading}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}