"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
export function PilotForm({ kind }: { kind: "creator" | "brand" | "contact" }) {
  const [preview, setPreview] = useState(false);
  return (
    <form
      className="pilot-form"
      onSubmit={(e) => {
        e.preventDefault();
        setPreview(true);
      }}
    >
      <p className="form-notice">
        Preview form. Your details stay in this browser and are not sent.
      </p>
      <div>
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
      <div>
        <Label htmlFor="email">
          {kind === "brand" ? "Work email" : "Email address"}
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      {kind === "creator" ? (
        <div>
          <Label htmlFor="profile">Creator profile</Label>
          <Input
            id="profile"
            name="profile"
            type="url"
            placeholder="Link to your public profile"
            required
          />
        </div>
      ) : kind === "brand" ? (
        <>
          <div>
            <Label htmlFor="company">Company or agency</Label>
            <Input
              id="company"
              name="company"
              autoComplete="organization"
              required
            />
          </div>
          <div>
            <Label htmlFor="idea">Campaign idea</Label>
            <Textarea
              id="idea"
              name="idea"
              placeholder="Product, audience and intended use"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" required />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us how we can help"
              required
            />
          </div>
        </>
      )}
      <p className="form-notice">
        Signing up grants no rights to your face or voice.{" "}
        <Link href="/privacy" className="underline">
          Privacy draft
        </Link>{" "}
        ·{" "}
        <Link href="/terms" className="underline">
          Terms draft
        </Link>
      </p>
      <Button size="lg" type="submit" className="brand-action">
        Preview next step
      </Button>
      {preview && (
        <p role="status" className="form-status">
          This is the end of the preview. No enquiry was sent, and no rights
          were granted.
        </p>
      )}
    </form>
  );
}
