import {NextResponse} from "next/server";

export async function GET(request: Request) {
  const isAuthenticated = request.headers.get("x-demo-auth") === "valid";

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication required",
      },
      {status: 401},
    );
  }

  return NextResponse.json({
    success: true,
    message: "Welcome to the private BugDesk API!",
  });
}
