import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const phase = searchParams.get("phase");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (category) {
      where.category = { slug: category };
    }
    if (phase) {
      where.phase = phase;
    }

    const profile = await prisma.userProfile.findFirst();
    const profileId = profile?.id;

    const questions = await prisma.dDQQuestion.findMany({
      where,
      orderBy: [
        { category: { sort_order: "asc" } },
        { sort_order: "asc" },
      ],
      include: {
        category: { select: { slug: true, name: true, icon: true } },
        responses: profileId
          ? { where: { profile_id: profileId }, take: 1 }
          : false,
      },
    });

    const result = questions.map((q) => ({
      id: q.id,
      slug: q.slug,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options ? JSON.parse(q.options) : null,
      min_value: q.min_value,
      max_value: q.max_value,
      step_value: q.step_value,
      default_value: q.default_value,
      helper_text: q.helper_text,
      required: q.required,
      phase: q.phase,
      category: q.category,
      answer: q.responses && q.responses.length > 0 ? JSON.parse(q.responses[0].answer) : null,
    }));

    return NextResponse.json(result);
  } catch (e) {
    console.error("GET /api/ddq/questions error:", e);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
