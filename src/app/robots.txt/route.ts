// app/robots.txt/route.ts

export function GET() {
	const body = `
        User-agent: Twitterbot
        Allow: /

        User-agent: *
        Allow: /
    `.trim();

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
