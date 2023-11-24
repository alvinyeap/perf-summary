export type LoggedFeedback = {
  createdAt: string;
  category: string;
  text: string;
};

export type Attribute = {
  attributeName: string;
  evidence: string;
};

export type ApiAiContentArg = {
  loggedFeedback?: LoggedFeedback[];
  goals?: string;
  feedback360?: string;
  companyValues?: string;
};

export type ApiAiContentReturn = {
  summary: string[];
  positive: Attribute[];
  negative: Attribute[];
};
