import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/data/siteConfig";
import {
  buildMailtoUrl,
  FIRST_TIME_OPTIONS,
  joinSchema,
  type JoinFormValues,
} from "@/lib/joinSchema";

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function JoinForm() {
  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      fullName: "",
      email: "",
      telephone: "",
      experience: "",
      message: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = handleSubmit((values) => {
    // Hand off to the visitor's mail client. Nothing is transmitted by this
    // site, so the toast is informational — never a false "we got your details".
    window.location.assign(buildMailtoUrl(values, siteConfig.contact.emailHref));

    toast.info("Your email app should now be open", {
      description:
        `Send the prepared email to ${siteConfig.contact.email}. Nothing is sent automatically — you still need to press send.`,
      duration: 10000,
    });

    reset();
  });

  return (
    <div className="border border-ink/15 bg-pure-white p-6 sm:p-9">
      <div className="mb-7">
        <h3 className="m-0 text-lg font-black tracking-[0.04em] text-ink uppercase">
          Join the Next Trail
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-gray">
          This form opens a pre-filled email in your own mail app addressed to{" "}
          {siteConfig.contact.email}. You will need to press send — this website
          cannot submit it for you.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Abdul Karim"
                    autoComplete="name"
                    className="h-11 rounded-sm border-ink/25 bg-pure-white placeholder:text-muted-gray/70"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.fullName?.message}</FormMessage>
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-11 rounded-sm border-ink/25 bg-pure-white placeholder:text-muted-gray/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="tel"
                      placeholder="+232 ..."
                      autoComplete="tel"
                      className="h-11 rounded-sm border-ink/25 bg-pure-white placeholder:text-muted-gray/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.telephone?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Running or walking experience</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. I run occasionally, or I walk"
                    className="h-11 rounded-sm border-ink/25 bg-pure-white placeholder:text-muted-gray/70"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Both abilities are equally welcome. All paces, all abilities.
                </FormDescription>
                <FormMessage>{errors.experience?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* A required Yes/No choice rather than a "must be ticked" checkbox:
              the club's own rules welcome existing Hashers, who may be exempted
              from the three-run requirement, so they must be able to answer No.

              The group is wrapped in `FormControl` so the shared error
              association applies. Previously the raw inputs carried
              `aria-invalid` but no `aria-describedby`, so a screen reader
              announced the field as invalid without ever saying why, and the
              RHF ref was attached to both inputs so the second one silently
              replaced the first and focus-on-error landed on the wrong radio. */}
          <FormField
            control={form.control}
            name="isFirstTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2">Is this your first Hash?</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex flex-wrap gap-x-6 gap-y-2"
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  >
                    {FIRST_TIME_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <RadioGroupItem
                          id={`isFirstTime-${option.value}`}
                          value={option.value}
                          className="border-ink/30 data-[state=checked]:border-gold-deep"
                        />
                        <Label
                          htmlFor={`isFirstTime-${option.value}`}
                          className="cursor-pointer text-sm leading-relaxed font-normal tracking-normal text-ink normal-case"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage>{errors.isFirstTime?.message}</FormMessage>
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Message <span className="text-muted-gray">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Anything you would like us to know?"
                    className="rounded-sm border-ink/25 bg-pure-white placeholder:text-muted-gray/70"
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.message?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-auto w-full justify-between rounded-sm bg-ink px-6 py-4 text-[0.78rem] font-black tracking-[0.08em] text-warm-white uppercase hover:bg-gold-bright hover:text-ink sm:w-auto"
          >
            Prepare my email
            <ArrowRight aria-hidden="true" />
          </Button>

          <p className="m-0 text-xs leading-relaxed text-muted-gray">
            We use your details only to reply about joining WWH3. Nothing is
            stored on this website.
          </p>
        </form>
      </Form>
    </div>
  );
}
