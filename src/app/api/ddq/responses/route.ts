import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

const responseSchema = z.object({
  question_id: z.number(),
  answer: z.unknown(), // Can be string, number, array, etc.
});

const batchResponseSchema = z.object({
  responses: z.array(responseSchema),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = batchResponseSchema.parse(body);

    const profile = await prisma.userProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: "Complete onboarding first" }, { status: 400 });
    }

    // Validate all question IDs exist
    const questionIds = parsed.responses.map((r) => r.question_id);
    const questions = await prisma.dDQQuestion.findMany({
      where: { id: { in: questionIds } },
    });
    const validIds = new Set(questions.map((q) => q.id));

    const results = await Promise.all(
      parsed.responses
        .filter((r) => validIds.has(r.question_id))
        .map((r) =>
          prisma.dDQResponse.upsert({
            where: {
              profile_id_question_id: {
                profile_id: profile.id,
                question_id: r.question_id,
              },
            },
            update: {
              answer: JSON.stringify(r.answer),
            },
            create: {
              profile_id: profile.id,
              question_id: r.question_id,
              answer: JSON.stringify(r.answer),
            },
          })
        )
    );

    return NextResponse.json({
      success: true,
      saved: results.length,
    });
  } catch (e) {
    console.error("POST /api/ddq/responses error:", e);
    return NextResponse.json({ error: "Failed to save responses" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const profile = await prisma.userProfile.findFirst();
    if (!profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    const responses = await prisma.dDQResponse.findMany({
      where: { profile_id: profile.id },
      include: {
        question: {
          include: { category: { select: { slug: true, name: true } } },
        },
      },
      orderBy: {
        question: { sort_order: "asc" },
      },
    });

    return NextResponse.json(
      responses.map((r) => ({
        question_id: r.question_id,
        question: r.question.question_text,
        category: r.question.category.slug,
        answer: JSON.parse(r.answer),
        updated_at: r.updated_at,
      }))
    );
  } catch (e) {
    console.error("GET /api/ddq/responses error:", e);
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 });
  }
}
