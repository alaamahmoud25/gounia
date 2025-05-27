import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();
  if (isProtectedRoute(req) && !authObj.userId) {
    // Redirect to sign-in or return 401
    return Response.redirect('/sign-in');
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
