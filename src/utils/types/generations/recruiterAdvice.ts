export const recruiter_decision_analysis = {
  type: "OBJECT",
  description:
    "Executive summary for recruiters to determine interview eligibility and role fit.",
  properties: {
    suitability_rating: {
      type: "NUMBER",
      description:
        "Score from 0.0 to 5.0 based on alignment with mandatory JD requirements.",
    },
    thrive_potential_rating: {
      type: "NUMBER",
      description:
        "Score from 0.0 to 5.0 predicting long-term success, leadership, and adaptability.",
    },
    recruiter_headline: {
      type: "STRING",
      description:
        "A 10-word 'hook' summarizing the candidate (e.g., 'Senior Lead with heavy AWS expertise but lacks FinTech exposure').",
    },
    decision_drivers: {
      type: "OBJECT",
      properties: {
        strengths_to_leverage: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Top 3 reasons to hire this person immediately.",
        },
        critical_gaps_and_risks: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Deal-breakers or areas requiring heavy management/training.",
        },
      },
    },
    role_fit_analysis: {
      type: "STRING",
      description:
        "Detailed reasoning for the scores, focusing on past achievements vs. future job demands.",
    },
    interview_priority: {
      type: "STRING",
      enum: ["High - Fast Track", "Medium - Proceed", "Low - Archive"],
      description: "A clear directive for the recruiting team.",
    },
  },
};
