import {NextResponse} from "next/server";
import {prisma} from "@/app/lib/prisma";
type RouteContext = {
  params: Promise<{id: string}>;
};
import {getSession} from "@/app/lib/auth-session";

export async function PATCH(request: Request, {params}: RouteContext) {
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
    const {id} = await params;
    const issueId = Number(id);

    if (!Number.isInteger(issueId) || issueId <= 0) {
      return NextResponse.json({error: "Invalid issue ID"}, {status: 400});
    }
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("status" in body) ||
      typeof body.status !== "string" ||
      !["OPEN", "IN_PROGRESS", "CLOSED"].includes(body.status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid status is required.",
        },
        {status: 400},
      );
    }

    const existionIssue = await prisma.issue.findUnique({where: {id: issueId}});

    if (!existionIssue) {
      return NextResponse.json(
        {
          success: false,
          message: "Issue not found",
        },
        {status: 404},
      );
    }

    const updateIssue = await prisma.issue.update({
      where: {id: issueId},
      data: {status: body.status},
    });

    return NextResponse.json({
      success: true,
      data: updateIssue,
    });
  } catch {
    return NextResponse.json({error: "Invalid JSON body"}, {status: 400});
  }
}

export async function DELETE(_request: Request, {params}: RouteContext) {
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
    const {id} = await params;
    const issueId = Number(id);

    if (!Number.isInteger(issueId) || issueId <= 0) {
      return NextResponse.json(
        {success: false, message: "Invalid issue ID."},
        {status: 400},
      );
    }

    const existingIssue = await prisma.issue.findUnique({
      where: {
        id: issueId,
      },
    });

    if (!existingIssue) {
      return NextResponse.json(
        {success: false, message: "Issue not found"},
        {status: 404},
      );
    }

    await prisma.issue.delete({where: {id: issueId}});

    return NextResponse.json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete issue",
      },
      {status: 500},
    );
  }
}
