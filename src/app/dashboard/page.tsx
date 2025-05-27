// Next.js
import { redirect } from 'next/navigation';

// Clerk
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  // Retrieve the current user information
  const user = await currentUser();

  // إذا لم يكن المستخدم مسجل دخول، وجهه لصفحة تسجيل الدخول
  if (!user) {
    redirect("/sign-in");
  }

  // الحصول على الدور بشكل آمن
  const role = user?.privateMetadata?.role;

  // إذا لم يوجد دور أو كان "USER"، وجه للصفحة الرئيسية
  if (!role || role === "USER") {
    redirect("/");
  }

  // إذا كان الدور "ADMIN"، وجه للوحة تحكم الأدمن
  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  // إذا كان الدور "SELLER"، وجه للوحة تحكم البائع
  if (role === "SELLER") {
    redirect("/dashboard/seller");
  }

  // واجهة بديلة في حال لم يتحقق أي شرط (لن تظهر غالبًا)
  return <div>غير مصرح لك أو الدور غير معروف.</div>;
}
