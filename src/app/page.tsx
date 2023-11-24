"use client";
import { useState } from "react";

import LOGGED_FEEDBACK from "@/data/LoggedFeedback.const";
import Toggle from "@/components/Toggle";
import LoggedFeedbackModal from "@/components/LoggedFeedbackModal";
import TextInputModal from "@/components/TextInputModal";
import { ApiAiContentReturn } from "@/types";

export default function Home() {
  // Switches
  const [loggedFeedbackSwitchChecked, setLoggedFeedbackSwitchChecked] =
    useState(true);
  const [goalsSwitchChecked, setGoalsSwitchChecked] = useState(false);
  const [feedback360SwitchChecked, setFeedback360SwitchChecked] =
    useState(false);
  const [companyValuesSwitchChecked, setCompanyValuesSwitchChecked] =
    useState(false);

  // Modals
  const [loggedFeedbackModalOpen, setLoggedFeedbackModalOpen] = useState(false);
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  const [feedback360ModalOpen, setFeedback360ModalOpen] = useState(false);
  const [companyValuesModalOpen, setCompanyValuesModalOpen] = useState(false);

  // Data
  const loggedFeedback = LOGGED_FEEDBACK;
  const [goals, setGoals] = useState("");
  const [feedback360, setFeedback360] = useState("");
  const [companyValues, setCompanyValues] = useState("");

  // Handlers
  const handleLoggedFeedbackSwitchChange = (checked: boolean) => {
    setLoggedFeedbackSwitchChecked(checked);
    setLoggedFeedbackModalOpen(checked);
  };

  const handleGoalsSwitchChange = (checked: boolean) => {
    setGoalsSwitchChecked(checked);
    setGoalsModalOpen(checked);
  };

  const handleFeedback360SwitchChange = (checked: boolean) => {
    setFeedback360SwitchChecked(checked);
    setFeedback360ModalOpen(checked);
  };

  const handleCompanyValuesSwitchChange = (checked: boolean) => {
    setCompanyValuesSwitchChecked(checked);
    setCompanyValuesModalOpen(checked);
  };

  // AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState<ApiAiContentReturn>({
    summary: [],
    positive: [],
    negative: [],
  });
  const handleGenerateButton = async () => {
    const url = `/api/ai/content`;
    const body = {
      loggedFeedback: loggedFeedbackSwitchChecked ? loggedFeedback : undefined,
      goals: goalsSwitchChecked ? goals : undefined,
      feedback360: feedback360SwitchChecked ? feedback360 : undefined,
      companyValues: companyValuesSwitchChecked ? companyValues : undefined,
    };

    setIsError(false);
    setIsGenerating(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setIsError(!response.ok);
      if (response.ok) {
        const responseJson = await response.json();
        setContent(responseJson);
      }
    } catch (error) {
      setIsError(true);
    }

    setIsGenerating(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      <div className="container mx-auto flex flex-col items-center">
        <div className="flex w-[40rem] flex-col py-10">
          <div className="flex flex-col gap-6 text-slate-900">
            <div className="text-left text-3xl font-semibold">
              Performance Review App
            </div>

            <div className="flex w-full flex-col gap-y-2">
              <div className="text-xl font-semibold">Inputs</div>
              <div className="flex w-full flex-col gap-y-2">
                <div className="flex w-full flex-row justify-between">
                  <div>Feedback you&apos;ve logged</div>
                  <Toggle
                    key="loggedFeedback"
                    checked={loggedFeedbackSwitchChecked}
                    onChange={handleLoggedFeedbackSwitchChange}
                  />
                </div>
                <div className="flex w-full flex-row justify-between">
                  <div>Goals and metrics</div>
                  <Toggle
                    key="goals"
                    checked={goalsSwitchChecked}
                    onChange={handleGoalsSwitchChange}
                  />
                </div>
                <div className="flex w-full flex-row justify-between">
                  <div>360 feedback</div>
                  <Toggle
                    key="feedback360"
                    checked={feedback360SwitchChecked}
                    onChange={handleFeedback360SwitchChange}
                  />
                </div>
                <div className="flex w-full flex-row justify-between">
                  <div>Company values</div>
                  <Toggle
                    key="companyValues"
                    checked={companyValuesSwitchChecked}
                    onChange={handleCompanyValuesSwitchChange}
                  />
                </div>
                <div className="mt-1 flex flex-row gap-x-4">
                  <button
                    disabled={isGenerating}
                    className={`rounded-md px-4 py-2 text-sm font-semibold ${
                      isGenerating
                        ? "cursor-not-allowed bg-slate-50"
                        : "bg-slate-200"
                    }`}
                    onClick={handleGenerateButton}
                  >
                    {isGenerating ? "⏳ Generating..." : "✨ Generate"}
                  </button>
                  <div
                    className={`flex items-center text-left text-red-600 ${
                      isError ? "" : "hidden"
                    }`}
                  >
                    Error generating AI content, please try again.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-y-2">
              <div className="text-xl font-semibold">Summary</div>
              <div className="flex min-h-[5rem] flex-col items-center justify-center gap-y-4 rounded-md bg-slate-200 p-8 text-sm">
                {content.summary.length > 0 ? (
                  content.summary.map((summaryItem, i) => (
                    <p key={i}>{summaryItem}</p>
                  ))
                ) : (
                  <p>Not yet generated</p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-y-2">
              <div className="text-xl font-semibold">Review</div>
              <div className="flex min-h-[5rem] w-full flex-col items-center justify-center gap-y-2 rounded-md bg-slate-200 p-8 text-sm">
                {content.positive.length > 0 ? (
                  content.positive.map((attr, i) => (
                    <div key={i} className="w-full">
                      <p className="w-full font-semibold">
                        {attr.attributeName}
                      </p>
                      <p className="w-full">{attr.evidence}</p>
                    </div>
                  ))
                ) : (
                  <p>Not yet generated</p>
                )}
              </div>
              <div className="flex min-h-[5rem] w-full flex-col items-center justify-center gap-y-2 rounded-md bg-slate-200 p-8 text-sm">
                {content.negative.length > 0 ? (
                  content.negative.map((attr, i) => (
                    <div key={i} className="w-full">
                      <p className="w-full font-semibold">
                        {attr.attributeName}
                      </p>
                      <p className="w-full">{attr.evidence}</p>
                    </div>
                  ))
                ) : (
                  <p>Not yet generated</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoggedFeedbackModal
        open={loggedFeedbackModalOpen}
        setOpen={setLoggedFeedbackModalOpen}
        items={loggedFeedback}
      />
      <TextInputModal
        key="goals"
        title="Goals and metrics"
        open={goalsModalOpen}
        setOpen={setGoalsModalOpen}
        text={goals}
        setText={setGoals}
        placeholder="Copy and paste your team member's goals and metrics."
      />
      <TextInputModal
        key="feedback360"
        title="360 Feedback"
        open={feedback360ModalOpen}
        setOpen={setFeedback360ModalOpen}
        text={feedback360}
        setText={setFeedback360}
        placeholder="Copy and paste your team member's 360 feedback."
      />
      <TextInputModal
        key="companyValues"
        title="Company values"
        open={companyValuesModalOpen}
        setOpen={setCompanyValuesModalOpen}
        text={companyValues}
        setText={setCompanyValues}
        placeholder="Copy and paste your team member's company values."
      />
    </main>
  );
}
