import { NextRequest, NextResponse } from "next/server";

import { OpenAI } from "openai";

export const runtime = "edge";

import {
  SYSTEM_PROMPT,
  ASSISTANT_MSG,
  DIRECTIONS_MSG,
  LOGGED_FEEDBACK_PREFIX,
  GOALS_PREFIX,
  FEEDBACK_360_PREFIX,
  COMPANY_VALUES_PREFIX,
} from "@/app/api/ai/content/prompts.const";
import { ApiAiContentArg, ApiAiContentReturn } from "@/types";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";

export const POST = async (req: NextRequest) => {
  // TODO: Validation
  const body = (await req.json()) as ApiAiContentArg;
  try {
    const content = await generateAiContent(body);
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
};

const generateAiContent = async ({
  loggedFeedback,
  goals,
  feedback360,
  companyValues,
}: ApiAiContentArg): Promise<ApiAiContentReturn> => {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "assistant", content: ASSISTANT_MSG },
  ];

  if (loggedFeedback && loggedFeedback.length > 0) {
    const loggedFeedbackStr = loggedFeedback
      .map((lf) => `${lf.createdAt}: ${lf.text}`)
      .join("\n\n");

    const loggedFeedbackMessage = `${LOGGED_FEEDBACK_PREFIX}\n\n${loggedFeedbackStr}`;
    messages.push({ role: "user", content: loggedFeedbackMessage });
  }

  if (goals && goals !== "") {
    messages.push({ role: "user", content: `${GOALS_PREFIX}\n\n${goals}` });
  }

  if (feedback360 && feedback360 !== "") {
    messages.push({
      role: "user",
      content: `${FEEDBACK_360_PREFIX}\n\n${feedback360}`,
    });
  }

  if (companyValues && companyValues !== "") {
    messages.push({
      role: "user",
      content: `${COMPANY_VALUES_PREFIX}\n\n${companyValues}`,
    });
  }

  messages.push({ role: "user", content: DIRECTIONS_MSG });

  const openai = new OpenAI();
  const start = Date.now();
  const resp = await openai.chat.completions.create({
    messages,
    model: "gpt-4-1106-preview",
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  const end = Date.now();
  console.log(end - start);

  if (resp.choices[0].message.content) {
    // TODO: Validation
    // Throws error if invalid JSON
    return JSON.parse(resp.choices[0].message.content) as ApiAiContentReturn;
  }
  throw new Error("Error generating content with OpenAI");
};
