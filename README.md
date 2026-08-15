# Sanjit Chakrabarti personal site

Source for `sanjitchakrabarti.com`, hosted on OpenAI Sites with a dedicated D1-backed PhonePe checkout at `/checkout`.

## Local development

1. Run `npm install`.
2. Configure PhonePe values through a protected local environment based on `.env.example`. Never commit secrets.
3. Run `npm run dev`.

The root static pages in `public/` preserve the existing personal-business site. The application routes provide the checkout and payment-status experience; the Worker owns PhonePe APIs and static/app routing.
