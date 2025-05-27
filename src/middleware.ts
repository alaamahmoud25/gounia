import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


export default clerkMiddleware(async (auth, req, next) => {
  const protectedRoutes = createRouteMatcher([
    '/dashboard',
    '/dashboard/(.*)',
    '/checkout',
    '/profile',
    '/profile/(.*)',
  ]);
  const authObj = await auth();
  if (protectedRoutes(req) && !authObj.userId) {
    // إعادة التوجيه إلى صفحة تسجيل الدخول
    return NextResponse.redirect(`${req.nextUrl.origin}/sign-in`);
  }
});


export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};