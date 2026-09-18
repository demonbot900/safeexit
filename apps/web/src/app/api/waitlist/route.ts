import { waitlistSignupSchema } from '@safeexit/api-contracts';

/**
 * Die Seite spricht nie direkt mit dem Backend.
 *
 * Gruende: die Backend-Adresse bleibt serverseitig, es gibt keine Freigabe fremder
 * Herkunft (CORS) im Backend, und die Pruefung passiert zweimal mit demselben
 * Schema aus packages/api-contracts.
 */
const BACKEND_URL = process.env.BACKEND_API_URL ?? 'http://localhost:3000';

export async function POST(request: Request): Promise<Response> {
  const payload = await request.json().catch(() => null);
  const parsed = waitlistSignupSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      { message: 'Bitte pruefe deine Eingaben.', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/v1/waitlist`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      return Response.json(
        { message: 'Die Vormerkung hat gerade nicht geklappt. Bitte spaeter noch einmal.' },
        { status: 502 },
      );
    }

    return Response.json(await response.json(), { status: 201 });
  } catch {
    return Response.json({ message: 'Das Backend ist nicht erreichbar.' }, { status: 502 });
  }
}
