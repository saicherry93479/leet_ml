// @ts-ignore
import { defineMiddleware, sequence } from "astro:middleware";
import { getSession } from "./lib/auth";

export const auth = defineMiddleware(
  async ({ cookies, redirect, locals, url }, next) => {
    const sessionId = cookies.get("authSession")?.value;
    const setupAuth = cookies.get("setup_auth")?.value;
    const tempAuth = cookies.get("temp_auth")?.value;
    // console.log('setupAuth ',setupAuth)
    if (setupAuth) {
      console.log("setUpASuth ", JSON.parse(setupAuth));
      locals.userId = JSON.parse(setupAuth).userId;
    }
    if (tempAuth) {
      console.log("setUpASuth ", JSON.parse(tempAuth));
      locals.userId = JSON.parse(tempAuth).userId;
    }
    let user = null;
    if (sessionId) {
      const session = await getSession(sessionId);
      console.log("session is ", session);
      if (session) {
        user = session.user ?? undefined;
        locals.session = session;
        locals.user = user;
      } else {
        cookies.delete("authSession", {
          httpOnly: true,
          secure: import.meta.env.PROD,
          path: "/",
        });
      }
    }
    console.log("user is ", user);

    if (url.pathname.startsWith("/_action")) return next();
    if (url.pathname.startsWith("/_server-islands")) return next();

    if (user) {
      if (url.pathname.startsWith("/auth")) {
        return redirect("/", 302);
      }
      if (url.pathname.startsWith("/admin") && user?.admin !== "Y") {
        return new Response("Not Found", { status: 404 });
      }
    } else {
      if (url.pathname.startsWith('/problems') ||url.pathname==='/newproblem'  || url.pathname==='/profile'  ) {
        return redirect("/", 302);
      }
    }

    // if (user) {
    //   if (!user.hasOnboarded) {
    //     if (url.pathname !== "/register" && url.pathname !== "/") {
    //       return redirect("/register", 302);
    //     }
    //   }
    // }

    // if (user) {
    //   if (user.hasOnboarded) {
    //     if (url.pathname === "/onboarding") return redirect("/jobs", 302);
    //     if (
    //       user.profile?.resumeAnalysed &&
    //       url.pathname === "/analyse_resume"
    //     ) {
    //       return redirect("/jobs", 302);
    //     } else if (
    //       !user.profile?.resumeAnalysed &&
    //       url.pathname !== "/analyse_resume"
    //     ) {
    //       return redirect("/analyse_resume", 302);
    //     }

    //     if (
    //       user.profile?.resumeAnalysed &&
    //       !user.profile.linkedinUrl &&
    //       url.pathname.startsWith("/jobs") &&
    //       url.pathname !== "/jobs/connect_linkedin"
    //     ) {
    //       cookies.set("redirect", url.pathname);
    //       return redirect("/jobs/connect_linkedin", 302);
    //     }
    //   } else if (!user.hasOnboarded) {
    //     if (url.pathname !== "/onboarding" && url.pathname !== "/") {
    //       return redirect("/onboarding", 302);
    //     }
    //   }
    // }

    const res = await next();
    // locals.user = null;
    return res;
  }
);

export const onRequest = sequence(auth);
