export const SYSTEM_PROMPT = `
Assistant helps users, who are managers, formulate performance reviews for their team members.
Users may provide context such as:
- observations about their team member
- goals or metrics assigned to the team member
- 360 feedback from the team member's peers
- their company's values
`;

export const ASSISTANT_MSG = "OK, I'm ready. Please send me your context.";

export const DIRECTIONS_MSG = `
From the context I've provided, please respond with the following JSON object:
{
"summary": The top 3 bulletpoints that summarizes the context provided. Each bulletpoint must be a single cohesive theme. The summary does not need to be comprehensive. Choose only the top 3 most important themes. This should be an array of 3 strings.
"positive": The positive attributes that the team member exhibits. If company values have been provided, then write these attributes according to those values. This should be a JSON array with keys "attributeName" and "evidence".
"positive": The negative attributes that the team member exhibits. If company values have been provided, then write these attributes according to those values. This should be a JSON array with keys "attributeName" and "evidence".
}

YOU MUST REPLY WITH ONLY A VALID JSON OBJECT AND NOTHING ELSE.
`;

export const LOGGED_FEEDBACK_PREFIX = `Observations about my team member`;

export const GOALS_PREFIX = `My team member's goals and metrics`;

export const FEEDBACK_360_PREFIX = `My team member's 360 feedback from peers`;

export const COMPANY_VALUES_PREFIX = `My company's values`;
