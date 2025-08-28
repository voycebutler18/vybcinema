import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background relative z-0" style={{ pointerEvents: 'auto' }}>
      <Navigation />
      
      <main className="pt-8 relative z-10" style={{ pointerEvents: 'auto' }}>
        <section className="py-16 relative z-20" style={{ pointerEvents: 'auto' }}>
          <div className="container mx-auto px-4" style={{ pointerEvents: 'auto' }}>
            <div className="max-w-md mx-auto" style={{ pointerEvents: 'auto' }}>
              <div className="cinema-card p-8 space-y-6" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 30 }}>
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-cinema-gradient">
                    Welcome Back
                  </h1>
                  <p className="text-muted-foreground">
                    Sign in to your VYB Cinema account
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100 }}>
                  <div className="space-y-2" style={{ pointerEvents: 'auto' }}>
                    <Label htmlFor="email" style={{ pointerEvents: 'auto' }}>Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ pointerEvents: 'auto', zIndex: 101 }}
                    />
                  </div>
                  
                  <div className="space-y-2" style={{ pointerEvents: 'auto' }}>
                    <Label htmlFor="password" style={{ pointerEvents: 'auto' }}>Password</Label>
                    <div className="relative" style={{ pointerEvents: 'auto' }}>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ pointerEvents: 'auto', zIndex: 101 }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ pointerEvents: 'auto', zIndex: 102 }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between" style={{ pointerEvents: 'auto' }}>
                    <div className="flex items-center space-x-2" style={{ pointerEvents: 'auto' }}>
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 text-primary border-border rounded"
                        style={{ pointerEvents: 'auto', zIndex: 101 }}
                      />
                      <Label htmlFor="remember" className="text-sm" style={{ pointerEvents: 'auto' }}>
                        Remember me
                      </Label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline" style={{ pointerEvents: 'auto', zIndex: 101 }}>
                      Forgot password?
                    </a>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-hero w-full"
                    style={{ pointerEvents: 'auto', zIndex: 101 }}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3" style={{ pointerEvents: 'auto', zIndex: 100 }}>
                  <Button variant="secondary" className="w-full" style={{ pointerEvents: 'auto', zIndex: 101 }}>
                    Continue with Google
                  </Button>
                  <Button variant="secondary" className="w-full" style={{ pointerEvents: 'auto', zIndex: 101 }}>
                    Continue with Apple
                  </Button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Sign up for free
                  </Link>
                </p>

                {/* Note about Supabase */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong>Welcome!</strong> Your authentication system is now ready. Create an account to get started.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;