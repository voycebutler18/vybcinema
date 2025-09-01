// src/pages/Signup.tsx
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

// ADDED: supabase + toast for saving profile fields
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    // (added previously)
    username: "",
    age: "",
    firstName: "",
  });
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ADDED: display choice for 18+ users
  const [displayNameMode, setDisplayNameMode] = useState<"username" | "full_name">("username");

  const ageNum = Number.parseInt(formData.age || "", 10);
  const isMinor = !Number.isNaN(ageNum) && ageNum < 18;

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // When age changes, force minors to username mode; give adults default "full_name"
  useEffect(() => {
    if (Number.isNaN(ageNum)) return;
    if (ageNum < 18) {
      setDisplayNameMode("username");
    } else {
      setDisplayNameMode((prev) => (prev === "username" || prev === "full_name" ? prev : "full_name"));
    }
  }, [ageNum]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // (from previous step) validate username/age & uniqueness
  const validateExtras = async () => {
    const u = formData.username.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(u)) {
      toast({
        title: "Invalid username",
        description: "Use 3–20 characters: letters, numbers, or underscores.",
        variant: "destructive",
      });
      return false;
    }

    const age = parseInt(formData.age, 10);
    if (Number.isNaN(age) || age < 13) {
      toast({
        title: "Age restriction",
        description: "You must be at least 13 to create an account.",
        variant: "destructive",
      });
      return false;
    }

    const { data: existing, error: checkErr } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", u)
      .limit(1);

    if (checkErr) {
      toast({
        title: "Signup error",
        description: checkErr.message,
        variant: "destructive",
      });
      return false;
    }
    if (existing && existing.length > 0) {
      toast({
        title: "Username taken",
        description: "Please choose another username.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const ok = await validateExtras();
    if (!ok) {
      setLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, formData.fullName);

    if (!error) {
      const age = parseInt(formData.age, 10);
      const minor = age < 18;

      // minors always username; adults use selected mode
      const modeToSave: "username" | "full_name" = minor ? "username" : displayNameMode;

      const { data: session } = await supabase.auth.getUser();
      const authedId = session.user?.id;

      if (authedId) {
        const { error: profileErr } = await supabase.from("profiles").upsert(
          {
            id: authedId,
            username: formData.username,
            first_name: formData.firstName || null,
            age,
            is_minor: minor,
            // ADDED: store how we will display the user's public name
            display_name_mode: modeToSave, // "username" | "full_name"
            // you can also store fullName you passed to signUp if you want quick reference
            full_name: formData.fullName || null,
          },
          { onConflict: "id" }
        );

        if (profileErr) {
          toast({
            title: "Profile save failed",
            description: profileErr.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created",
            description: minor
              ? "Your account is set up to show your username only."
              : modeToSave === "full_name"
              ? "Your account will display your full name publicly."
              : "Your account will display your username publicly.",
          });
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-8">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="cinema-card p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-cinema-gradient">
                    Join VYB Cinema
                  </h1>
                  <p className="text-muted-foreground">
                    Create your free account and start watching
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username (required) */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="your_handle"
                      className="w-full"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      3–20 characters. Letters, numbers, and underscores only.
                    </p>
                  </div>

                  {/* Age (required) */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min={13}
                      max={120}
                      placeholder="Enter your age"
                      className="w-full"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You must be at least 13. Ages 13–17 are set as minors (publicly show username only).
                    </p>
                  </div>

                  {/* For 18+ only: choice to show Full name or Username */}
                  {!Number.isNaN(ageNum) && ageNum >= 18 && (
                    <div className="space-y-2">
                      <Label>Public display</Label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="displayNameMode"
                            value="full_name"
                            checked={displayNameMode === "full_name"}
                            onChange={() => setDisplayNameMode("full_name")}
                          />
                          Show my full name
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="displayNameMode"
                            value="username"
                            checked={displayNameMode === "username"}
                            onChange={() => setDisplayNameMode("username")}
                          />
                          Show my username
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You can change this later in Settings.
                      </p>
                    </div>
                  )}

                  {/* First name (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name (optional)</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name (optional)"
                      className="w-full"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Your original fields (unchanged) */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="w-full pr-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 mt-1 text-primary border-border rounded"
                      required
                    />
                    <Label htmlFor="terms" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="marketing"
                      className="w-4 h-4 mt-1 text-primary border-border rounded"
                    />
                    <Label htmlFor="marketing" className="text-sm leading-5">
                      Send me updates about new content and platform features
                    </Label>
                  </div>

                  <Button type="submit" disabled={loading} className="btn-hero w-full">
                    {loading ? "Creating Account..." : "Create Account"}
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

                {/* Social Signup */}
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full">
                    Sign up with Google
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Sign up with Apple
                  </Button>
                </div>

                {/* Login Link */}
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>

                {/* Note about minors */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong>Safety first:</strong> Users aged 13–17 are displayed by username only.
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

export default Signup;
