import * as React from "react";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Profile: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 pt-24 pb-20">
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>

        {!user ? (
          <Card className="mt-6 p-6">
            <p className="text-muted-foreground">
              You’re not signed in.{" "}
              <Link to="/login" className="text-primary underline">
                Sign in
              </Link>{" "}
              to view your profile.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card className="p-6 space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div className="text-lg font-semibold">
                  {profile?.username || "—"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Full name</div>
                <div className="text-lg font-semibold">
                  {profile?.full_name || "—"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-lg font-semibold">{user.email}</div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Age: {profile?.age != null ? profile.age : "—"}
                </Badge>
                <Badge variant="outline">
                  {profile?.show_full_name ? "Showing full name" : "Showing username"}
                </Badge>
              </div>

              <div className="pt-2">
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Tip</h2>
              <p className="text-sm text-muted-foreground">
                You can change what’s shown (full name vs username) by editing your
                profile in the Dashboard.
              </p>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
