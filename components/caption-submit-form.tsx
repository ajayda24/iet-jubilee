"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DEPARTMENTS, Department, YEARS, Year } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  User,
  Building2,
  MessageSquareText,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { se } from "date-fns/locale";

interface CaptionSubmitFormProps {
  userId: string;
  userEmail: string | undefined;
  profile: any | null;
  captionCount: any | null;
}

const STEPS = [
  { id: 1, title: "Your Info", icon: User },
  { id: 2, title: "Department", icon: Building2 },
  { id: 3, title: "Caption", icon: MessageSquareText },
];

export function CaptionSubmitForm({
  userId,
  userEmail,
  profile,
  captionCount,
}: CaptionSubmitFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [studentID, setStudentID] = useState(profile?.student_id || "");
  const [authorName, setAuthorName] = useState(profile?.full_name || "");
  const [department, setDepartment] = useState<Department | "">(
    profile?.department || "",
  );
  const [year, setYear] = useState<Year | "">(profile?.year || "");
  const [captionText, setCaptionText] = useState("");

  const supabase = createClient();

  useEffect(() => {
    console.log(captionCount, "captioncount");

    if (captionCount >= 1) setStep(3);
  }, [open]);

  useEffect(() => {
    setAuthorName(profile?.full_name || "");
    setStudentID(profile?.student_id || "");
    setDepartment(profile?.department || "");
    setYear(profile?.year || "");
  }, []);

  const handleSubmit = async () => {
    console.log(authorName, department, captionText);

    if (!authorName || !department || !captionText) return;

    setLoading(true);
    setError(null);

    if (!profile) {
      await supabase.from("profiles").insert({
        id: userId,
        email: userEmail,
        student_id: studentID,
        full_name: authorName,
        year,
        department,
      });
    }

    const { error: insertError } = await supabase.from("captions").insert({
      caption_text: captionText.trim(),
      author_name: authorName.trim(),
      department,
      user_id: userId,
      profile_id: userId,
    });

    if (insertError) {
      const errorMsg =
        insertError.code === "PGRST205" ||
        insertError.message?.includes("Could not find the table")
          ? "Database tables not initialized. Please run the SQL migration and refresh."
          : insertError.message || "Failed to submit caption";
      setError(errorMsg);
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
    resetForm();
    router.refresh();
  };

  const resetForm = () => {
    setStep(1);
    setStudentID("");
    setAuthorName("");
    setDepartment("");
    setYear("");
    setCaptionText("");
    setError(null);
  };

  const canProceed = () => {
    if (step === 1)
      return authorName.trim().length >= 2 && studentID.trim().length >= 2;
    if (step === 2) return department !== "" && year !== "";
    if (step === 3) return captionText.trim().length >= 5;
    return false;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Submit Caption
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit a Caption</DialogTitle>
          <DialogDescription>
            Share your creative caption idea for the Jubilee event
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between px-2 py-4">
          {STEPS.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    step > s.id
                      ? "bg-primary text-primary-foreground"
                      : step === s.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {step > s.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 font-medium",
                    step >= s.id ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2 transition-colors duration-300",
                    step > s.id ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[160px] py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student ID</Label>
                <Input
                  id="name"
                  placeholder="IEAXXXXXX"
                  value={studentID}
                  onChange={(e) => setStudentID(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  autoFocus
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Name will be displayed alongside your caption
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={year}
                  onValueChange={(val) => setYear(val as Year)}
                  defaultValue={profile?.year || ""}
                >
                  <SelectTrigger id="year" className="w-full">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={department}
                  onValueChange={(val) => setDepartment(val as Department)}
                  defaultValue={profile?.department || ""}
                >
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caption">Your Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Write your creative caption idea..."
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  rows={4}
                  className="resize-none"
                  autoFocus
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Make it memorable and creative!
              </p>
              <p className="text-sm text-muted-foreground">
                You already submitted {captionCount} caption(s).
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1 || captionCount >= 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed() || loading}>
              {loading ? "Submitting..." : "Submit Caption"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
