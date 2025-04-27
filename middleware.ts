// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { initializeSecrets } from "./lib/store"

// // Initialize secrets when the server starts
// let initialized = false

// export async function middleware(request: NextRequest) {
//   // Initialize secrets only once
//   if (!initialized) {
//     await initializeSecrets()
//     initialized = true
//   }

//   return NextResponse.next()
// }

// // See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - images/* (image files)
//      * - public/* (public files)
//      */
//     "/((?!_next/static|_next/image|favicon.ico|images|public).*)",
//   ],
// }
