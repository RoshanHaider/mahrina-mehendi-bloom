import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address" })
  .max(255, { message: "Email is too long" });

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({ title: "Invalid email", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.toLowerCase() });
    setLoading(false);

    if (error) {
      const dup = error.code === "23505" || /duplicate/i.test(error.message);
      toast({
        title: dup ? "You're already subscribed" : "Subscription failed",
        description: dup ? "Thanks — your email is already on the list." : error.message,
        variant: dup ? "default" : "destructive",
      });
      return;
    }
    setEmail("");
    toast({ title: "Welcome to Mahrina", description: "You're subscribed — botanical updates incoming." });
  }

  return (
    <section className="py-16 bg-parchment border-t border-border">
      <div className="container max-w-3xl">
        <h3 className="font-display text-3xl md:text-4xl text-ink mb-2">
          Sign Up &amp; Stay Connected With Us
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          New designs, gentle tutorials and quiet offers — straight to your inbox.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email address"
            aria-label="Email address"
            className="flex-1 px-5 py-4 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-background border border-border text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-bark"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-lg sm:rounded-l-none sm:rounded-r-lg bg-ink text-background font-semibold tracking-wider uppercase text-sm hover:bg-bark transition-colors disabled:opacity-60"
          >
            {loading ? "..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
