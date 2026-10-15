import {getSession} from "@/app/lib/auth-session";
import {prisma} from "@/app/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication Required",
        },
        {status: 401},
      );
    }

    const issues = await prisma.issue.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: issues,
    });
  } catch (error) {
    console.log("Failed to fetch issues", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch issues",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication Required",
        },
        {status: 401},
      );
    }
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("title" in body) ||
      typeof body.title !== "string" ||
      body.title.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A non-empty title is required.",
        },
        {status: 400},
      );
    }

    const title = body.title.trim();
    const description =
      "description" in body && typeof body.description === "string"
        ? body.description.trim() || null
        : null;

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: issue,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to create issue.", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create issue",
      },
      {status: 500},
    );
  }
}
