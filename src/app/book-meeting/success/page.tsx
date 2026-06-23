import { CheckCircle2, Home } from "lucide-react";

export const metadata = {
  title:
    "Meeting Request Sent",

  description:
    "Your meeting request has been successfully submitted.",
};

export default function MeetingSuccessPage() {
  return (
    <div className="container mx-auto max-w-xl min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 text-center bg-background text-foreground transition-colors duration-200">
      
      {/* SUCCESS CONTAINER CARD */}
      <div className="w-full bg-card border border-border/60 rounded-2xl p-6 sm:p-10 shadow-xl shadow-black/2 dark:shadow-black/20">
        
        {/* Animated Accent Success Icon */}
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-6">
          <CheckCircle2 size={32} className="animate-in zoom-in-50 duration-300" />
        </div>

       <p className="mb-8 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
  Thank you for choosing{" "}
  <span className="font-semibold text-foreground">
    Zaynex
  </span>
  . Your meeting request has been received successfully.
  Our team will review it and send your meeting confirmation and joining link to your email shortly.
</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">

  <a
    href="https://www.zaynex.tech"
    className="inline-flex items-center justify-center gap-2 w-full sm:flex-1 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow transition-all hover:opacity-95 active:scale-[0.99]"
  >
    <Home size={16} />
    Back to Zaynex
  </a>



</div>

      </div>

    <p className="mt-6 text-xs text-muted-foreground/60 tracking-wide">
  Building modern websites, web applications, and digital solutions for growing businesses.
</p>

    </div>
  );
}