import { z } from 'zod';

/**
 * Die Segmente aus dem Businessplan 4.1. Der Nachfragetest soll zeigen, welches
 * Segment wirklich zuerst kauft, deshalb fragt das Formular danach.
 */
export const WAITLIST_SEGMENTS = ['kind', 'senioren', 'beruf', 'heimweg'] as const;
export type WaitlistSegment = (typeof WAITLIST_SEGMENTS)[number];

export const waitlistSignupSchema = z.object({
  email: z.string().email().max(254),
  segment: z.enum(WAITLIST_SEGMENTS),
  /** Freiwillig. Zeigt, wo eine Pilotstadt sich lohnt. */
  postalCode: z
    .string()
    .regex(/^\d{5}$/, 'Bitte eine fuenfstellige Postleitzahl angeben')
    .optional(),
  /** Ohne Einwilligung keine Speicherung. */
  consent: z.literal(true),
});

export type WaitlistSignup = z.infer<typeof waitlistSignupSchema>;

export interface WaitlistSignupResponse {
  /** Wie viele Vormerkungen es insgesamt gibt. Ziel laut Fahrplan: ueber 300. */
  total: number;
}
