// src/pages/api/problems/index.ts
import { db } from "@/lib/db";
import {
  examples,
  problems,
  problemTags,
  problemToTags,
  testCases,
} from "@/lib/db/schema";
import type { APIRoute } from "astro";


import { eq } from "drizzle-orm";

// Get all problems
export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const difficulty = searchParams.get("difficulty");
    const category = searchParams.get("category");
    const isPremium = searchParams.get("isPremium");

    let query = db
      .select()
      .from(problems)
      .leftJoin(problemToTags, eq(problems.id, problemToTags.problemId))
      .leftJoin(problemTags, eq(problemToTags.tagId, problemTags.id))
      .where(eq(problems.show, "Yes"));

    if (difficulty) {
      query = query.where(eq(problems.difficulty, difficulty));
    }
    if (category) {
      query = query.where(eq(problems.category, category));
    }
    if (isPremium) {
      query = query.where(eq(problems.isPremium, isPremium === "true"));
    }

    const result = await query;

    // Group the results by problem and collect tags
    const problemsMap = new Map();
    result.forEach((row) => {
      if (!problemsMap.has(row.problems.id)) {
        problemsMap.set(row.problems.id, {
          ...row.problems,
          tags: row.problem_tags ? [row.problem_tags] : [],
        });
      } else if (row.problem_tags) {
        problemsMap.get(row.problems.id).tags.push(row.problem_tags);
      }
    });

    return new Response(JSON.stringify(Array.from(problemsMap.values())), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching problems",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

// Create new problem
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Start a transaction
    return await db.transaction(async (tx) => {
      // 1. Create the problem
      const [problem] = await tx
        .insert(problems)
        .values({
          title: data.title,
          difficulty: data.difficulty,
          description: data.description,
          inputFormat: data.inputFormat,
          outputFormat: data.outputFormat,
          constraints: data.constraints,
          category: data.category,
          order: data.order,
          videoId: data.videoId,
          starterCode: data.starterCode,
          isPremium: data.isPremium,
        })
        .returning();

      // 2. Create examples
      if (data.examples?.length) {
        await tx.insert(examples).values(
          data.examples.map((example: any) => ({
            problemId: problem.id,
            inputText: example.inputText,
            outputText: example.outputText,
            explanation: example.explanation,
          }))
        );
      }

      // 3. Create test cases
      if (data.testCases?.length) {
        await tx.insert(testCases).values(
          data.testCases.map((testCase: any) => ({
            problemId: problem.id,
            input: testCase.input,
            output: testCase.output,
          }))
        );
      }

      // 4. Handle tags
      if (data.tags?.length) {
        // Create new tags if they don't exist
        const tagPromises = data.tags.map(async (tagName: string) => {
          const existingTag = await tx
            .select()
            .from(problemTags)
            .where(eq(problemTags.name, tagName))
            .limit(1);

          if (existingTag.length === 0) {
            const [newTag] = await tx
              .insert(problemTags)
              .values({ name: tagName })
              .returning();
            return newTag;
          }
          return existingTag[0];
        });

        const tags = await Promise.all(tagPromises);

        // Create problem-tag associations
        await tx.insert(problemToTags).values(
          tags.map((tag) => ({
            problemId: problem.id,
            tagId: tag.id,
          }))
        );
      }

      return new Response(
        JSON.stringify({
          message: "Problem created successfully",
          problem: problem,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    return new Response(
      JSON.stringify({
        message: "Error creating problem",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
