import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PredictorForm, PredictionResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: PredictorForm = await req.json();
    const { exam, rank, percentile, category, preferredState, maxFees, preferredField } = body;

    if (!exam || !category || !preferredField) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!rank && !percentile) {
      return NextResponse.json({ error: "Rank or percentile is required" }, { status: 400 });
    }

    const where: any = {
      examAccepted: { has: exam },
    };

    if (preferredField) {
      where.courses = { some: { field: preferredField } };
    }

    if (preferredState) {
      where.state = preferredState;
    }

    if (maxFees) {
      where.feesMax = { lte: maxFees };
    }

    const colleges = await prisma.college.findMany({
      where,
      take: 20,
      include: {
        courses: {
          where: { field: preferredField },
          take: 1,
        },
      },
      orderBy: { overallRating: "desc" },
    });

    if (!colleges.length) {
      return NextResponse.json({ error: "No matching colleges found" }, { status: 404 });
    }

    const collegeData = colleges.map((c: any) => ({
      name: c.name,
      location: `${c.city}, ${c.state}`,
      rating: c.overallRating,
      fees: `₹${c.feesMin.toLocaleString()} - ₹${c.feesMax.toLocaleString()}`,
      placement: c.placementAvg ? `₹${c.placementAvg.toLocaleString()}` : "N/A",
      topCourse: c.courses[0]?.name || "N/A",
    }));

    let predictions: any[] = [];

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      const prompt = `Student Profile:
- Exam: ${exam}
- ${rank ? `Rank: ${rank}` : `Percentile: ${percentile}`}
- Category: ${category}
- Field: ${preferredField}
${preferredState ? `- State: ${preferredState}` : ""}
${maxFees ? `- Budget: ₹${maxFees}` : ""}

Colleges:
${JSON.stringify(collegeData, null, 2)}

Recommend top 5 colleges as Safe/Moderate/Ambitious. Return only a raw JSON array:
[{"collegeName": string, "admissionChance": "Safe" | "Moderate" | "Ambitious", "reason": string, "keyStrengths": string}]`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().replace(/```json|```/g, "").trim();
      predictions = JSON.parse(text);

      if (!Array.isArray(predictions)) throw new Error("Invalid format");
    } catch (e) {
      return NextResponse.json({
        data: {
          predictions: null,
          fallbackColleges: colleges,
          fallbackReason: "Live AI prediction is currently unavailable. Showing database matches instead.",
        },
      });
    }

    const enrichedResults = predictions
      .map((p) => ({
        ...p,
        college: colleges.find((c: any) => c.name === p.collegeName) || null,
      }))
      .filter((p) => p.college !== null);

    return NextResponse.json({ data: { predictions: enrichedResults } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
  }
}
