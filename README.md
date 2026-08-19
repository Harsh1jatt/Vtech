# VTech Institute

Production website foundation for VTech Institute, built with Next.js 16 App Router and JavaScript.

## Architecture

- `app/`: Root App Router. The `(public)` route group owns the public site and its layout; `admin` owns the protected administration area; `api` will contain thin Route Handlers.
- `components/`: Reusable layout, UI, public-site, and admin components. Files currently contain minimal placeholders only.
- `config/`: Centralized site settings and static course configuration.
- `lib/`: Infrastructure boundaries for MongoDB, Cloudinary, authentication, and shared utilities.
- `models/`: Mongoose model contracts for admins, students, certificates, and enquiries. Mongoose schemas are intentionally deferred until the database dependency is introduced.
- `services/`: Business and data operation boundaries used by Route Handlers and server components.
- `public/`: Static images, icons, and local development asset directories.
- `proxy.js`: Reserved for server-side admin/API access protection, following the Next.js 16 convention.

## Environment

Copy `.env.example` to `.env.local` and provide real values locally. `.env.local` is ignored by Git; never expose server secrets through `NEXT_PUBLIC_*` variables.

## Development

```bash
npm run dev
npm run lint
npm run build
```

## Roadmap

1. Add Mongoose and implement a cached connection in `lib/db.js`.
2. Convert model field contracts into schemas with validation, timestamps, and unique/indexed fields.
3. Add secure admin authentication with hashed passwords, signed sessions, and middleware/API authorization.
4. Implement service methods and protected student, certificate, and enquiry Route Handlers.
5. Implement Cloudinary upload and certificate metadata persistence.
6. Build public pages, certificate verification, enquiry submission, and admin workflows with focused client components.
7. Add validation, authorization, error states, tests, and production SEO/social assets.

## Deliberate Decisions

- The project now uses a root-level `app/` directory because the requested project contract says `src` is not used. The generated `src/` scaffold was removed.
- Next.js 16's `proxy.js` convention is used instead of the older `middleware.js` filename; the request interception boundary remains the same.
- Public pages live in a route group, so `(public)` does not appear in URLs while still providing a separate public layout.
- No new dependencies were installed. Mongoose, Cloudinary, and authentication libraries should be selected and added when their implementation task begins.
- Model files currently export framework-neutral field contracts instead of importing Mongoose, keeping this architecture stage buildable without database packages.
- API placeholders return `501 Not Implemented`; they are structural markers, not production endpoints.
