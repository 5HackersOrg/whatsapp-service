export const universalResumeTemplate = {
  type: "OBJECT",
  properties: {
    personal_details: {
      type: "OBJECT",
      properties: {
        full_name: {
          type: "STRING",
          description: "The full name of the resume owner.",
        },
        title_or_position: {
          type: "STRING",
          description: "The current or target job title/position.",
        },
        photo_url: {
          type: "STRING",
          description:
            "URL to the candidate's professional photo, if available.",
        },
        contact: {
          type: "OBJECT",
          properties: {
            phone: { type: "STRING" },
            email: { type: "STRING" },
            address: { type: "STRING" },
            linkedin: { type: "STRING" },
            github: { type: "STRING" },
            website_or_portfolio: { type: "STRING" },
            social_links: {
              type: "ARRAY",
              items: { type: "STRING" },
              description:
                "Other relevant social media links (e.g., Twitter, Medium).",
            },
          },
        },
      },
    },
    professional: {
      type: "OBJECT",
      description:
        "Comprehensive structured data representing a candidate's professional profile, including experience, education, skills, and related career data.",
      properties: {
        summary: {
          type: "STRING",
          description: "A brief professional summary or profile.",
        },
        objectives: {
          type: "STRING",
          description: "The candidate's career objectives, if listed.",
        },
        experience: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              organization: { type: "STRING" },
              industry: { type: "STRING" },
              location: { type: "STRING" },
              employment_type: {
                type: "STRING",
                description: "e.g., Full-time, Part-time, Contract.",
              },
              start_date: {
                type: "STRING",
                description: "Format as YYYY-MM or Month YYYY.",
              },
              end_date: {
                type: "STRING",
                description: "Format as YYYY-MM or Month YYYY, or 'Present'.",
              },
              currently_working: { type: "BOOLEAN" },
              description: {
                type: "STRING",
                description: "A high-level overview of the role.",
              },
              responsibilities: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Key duties and tasks.",
              },
              achievements: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Measurable accomplishments, if available.",
              },
              technologies_used: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "Specific tools or languages used in the role.",
              },
            },
          },
        },
        education: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              institution: { type: "STRING" },
              degree_or_certification: { type: "STRING" },
              field_of_study: { type: "STRING" },
              location: { type: "STRING" },
              start_date: {
                type: "STRING",
                description: "Format as YYYY-MM or Month YYYY.",
              },
              end_date: {
                type: "STRING",
                description: "Format as YYYY-MM or Month YYYY, or 'Present'.",
              },
              gpa_or_grade: { type: "STRING" },
              relevant_coursework: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              thesis_or_project: { type: "STRING" },
            },
          },
        },

        projects: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              role: { type: "STRING" },
              organization_or_context: { type: "STRING" },
              dates: { type: "STRING" },
              technologies: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              description: { type: "STRING" },
              achievements: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              url: { type: "STRING" },
            },
          },
        },
        certifications: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              issuer: { type: "STRING" },
              issue_date: {
                type: "STRING",
                description: "Format as YYYY-MM-DD or Month YYYY.",
              },
              expiry_date: {
                type: "STRING",
                description: "Format as YYYY-MM-DD or Month YYYY, or 'N/A'.",
              },
              credential_id: { type: "STRING" },
              url: { type: "STRING" },
            },
          },
        },
        skills: {
          type: "OBJECT",
          properties: {
            technical: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            soft: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            languages: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            frameworks_or_libraries: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            tools_or_platforms: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
            other: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
          },
        },
        awards_and_achievements: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              issuer: { type: "STRING" },
              date: {
                type: "STRING",
                description: "Format as YYYY-MM-DD or Month YYYY.",
              },
              description: { type: "STRING" },
            },
          },
        },
        volunteer_experience: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              role: { type: "STRING" },
              organization: { type: "STRING" },
              location: { type: "STRING" },
              dates: { type: "STRING" },
              description: { type: "STRING" },
            },
          },
        },
        publications: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              publisher: { type: "STRING" },
              date: {
                type: "STRING",
                description: "Format as YYYY-MM-DD or Month YYYY.",
              },
              url: { type: "STRING" },
              description: { type: "STRING" },
            },
          },
        },
        memberships: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              organization: { type: "STRING" },
              role: { type: "STRING" },
              dates: { type: "STRING" },
              description: { type: "STRING" },
            },
          },
        },
        references: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              title_or_position: { type: "STRING" },
              organization: { type: "STRING" },
              relationship: { type: "STRING" },
              phone: { type: "STRING" },
              email: { type: "STRING" },
            },
          },
        },
      },
    },
    ai_analysis_hints: {
      type: "OBJECT",
      properties: {
        industry: { type: "STRING" },
        highest_education: {
          type: "STRING",
          description: "highest education the candidate has achieved",
        },
        experience_level: { type: "STRING" },
        primary_focus_area: { type: "STRING" },
        core_skill_set: { type: "STRING" },
        target_role: { type: "STRING" },
        education_level: {
          type: "string",
          description:
            "The candidate's education level value of the  education mapping",
        },
        xp: {
          type: "string",
          description:
            "The candidate's experience level match it with the experience mapping",
        },
      },
    },
  },
};
