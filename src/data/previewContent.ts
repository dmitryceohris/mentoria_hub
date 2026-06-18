import type { Course, Opportunity } from "./content";

export const previewCourses: Course[] = [
  {
    "id": "preview-english-academic-success",
    "track": "Mentoria English",
    "title": "English for Academic Success",
    "description": "Academic vocabulary, reading, writing, and communication skills for school, programs, and applications.",
    "difficulty": "Beginner",
    "tags": [
      "english",
      "admissions",
      "writing"
    ],
    "progress": 62,
    "lessons": [
      {
        "id": "academic-vocabulary",
        "title": "Academic Vocabulary",
        "description": "Build a reusable bank of academic verbs, nouns, and sentence patterns for school and application writing.",
        "duration": "18 min",
        "video": {
          "label": "Video placeholder: academic vocabulary strategy",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Write 8 sentences about one target topic using academic verbs and precise nouns.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "vocabulary-bank-1",
            "title": "Vocabulary bank",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Vocabulary%20bank%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "practice-worksheet-2",
            "title": "Practice worksheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Practice%20worksheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "academic-vocabulary-check-1",
              "prompt": "Which word choice sounds most formal in an academic paragraph?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "academic-vocabulary-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "academic",
              "acceptedAnswers": [
                "academic",
                "vocabulary"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "academic-vocabulary-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "reading-skimming-scanning",
        "title": "Academic Reading 1: Skimming and Scanning",
        "description": "Use fast reading strategies to find the main topic, key facts, and target details in a text.",
        "duration": "17 min",
        "video": {
          "label": "Video placeholder: skimming and scanning",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Skim one article and scan it for five named facts.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "reading-guide-1",
            "title": "Reading guide",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Reading%20guide%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "practice-passage-2",
            "title": "Practice passage",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Practice%20passage%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "reading-skimming-scanning-check-1",
              "prompt": "What is the difference between skimming and scanning?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "reading-skimming-scanning-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "academic",
              "acceptedAnswers": [
                "academic",
                "reading",
                "skimming",
                "scanning"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "reading-skimming-scanning-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "reading-critical-analysis",
        "title": "Academic Reading 2: Critical Analysis",
        "description": "Identify claims, evidence, and bias so you can read like a student and not just a decoder.",
        "duration": "20 min",
        "video": {
          "label": "Video placeholder: critical reading",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Annotate a short article for main idea, evidence, and assumptions.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "annotation-sheet-1",
            "title": "Annotation sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Annotation%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "reading-checklist-2",
            "title": "Reading checklist",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Reading%20checklist%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "reading-critical-analysis-check-1",
              "prompt": "What should you look for when checking an author's argument?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "reading-critical-analysis-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "academic",
              "acceptedAnswers": [
                "academic",
                "reading",
                "critical",
                "analysis"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "reading-critical-analysis-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "writing-process",
        "title": "The Writing Process",
        "description": "Move from brainstorming to outlining and drafting without losing your core idea.",
        "duration": "19 min",
        "video": {
          "label": "Video placeholder: writing workflow",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Plan a one-page draft with brainstorm, outline, and first paragraph.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "writing-planner-1",
            "title": "Writing planner",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Writing%20planner%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "draft-outline-2",
            "title": "Draft outline",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Draft%20outline%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "writing-process-check-1",
              "prompt": "Which step usually happens before the first draft?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "writing-process-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "writing",
              "acceptedAnswers": [
                "writing",
                "process"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "writing-process-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "paragraph-structure",
        "title": "Paragraph Structure",
        "description": "Build one strong paragraph with a topic sentence, development, and a clear close.",
        "duration": "16 min",
        "video": {
          "label": "Video placeholder: paragraph anatomy",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Rewrite a weak paragraph using one clear topic sentence and two support points.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "paragraph-frame-1",
            "title": "Paragraph frame",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Paragraph%20frame%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "sample-response-2",
            "title": "Sample response",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Sample%20response%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "paragraph-structure-check-1",
              "prompt": "What is the job of the topic sentence?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "paragraph-structure-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "paragraph",
              "acceptedAnswers": [
                "paragraph",
                "structure"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "paragraph-structure-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "essay-structure",
        "title": "Essay Structure",
        "description": "Organize an introduction, body paragraphs, and conclusion around one sharp thesis.",
        "duration": "22 min",
        "video": {
          "label": "Video placeholder: essay skeleton",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Outline a three-paragraph essay on a school-related prompt.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "essay-outline-1",
            "title": "Essay outline",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Essay%20outline%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "thesis-examples-2",
            "title": "Thesis examples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Thesis%20examples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "essay-structure-check-1",
              "prompt": "Where should the thesis statement usually appear?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "essay-structure-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "essay",
              "acceptedAnswers": [
                "essay",
                "structure"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "essay-structure-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "essay-types",
        "title": "Types of Academic Essays",
        "description": "Compare structure and purpose in compare-contrast and persuasive essays.",
        "duration": "18 min",
        "video": {
          "label": "Video placeholder: essay types",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Choose the right essay type for two different prompts.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "essay-samples-1",
            "title": "Essay samples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Essay%20samples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "prompt-sorter-2",
            "title": "Prompt sorter",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Prompt%20sorter%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "essay-types-check-1",
              "prompt": "Which essay type is designed to convince a reader?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "essay-types-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "types",
              "acceptedAnswers": [
                "types",
                "academic",
                "essays"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "essay-types-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "research-skills",
        "title": "Research Skills",
        "description": "Find credible academic sources, search with intent, and check whether a source is reliable.",
        "duration": "20 min",
        "video": {
          "label": "Video placeholder: research workflow",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Find two credible sources and explain why each is useful.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "source-checklist-1",
            "title": "Source checklist",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Source%20checklist%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "search-plan-2",
            "title": "Search plan",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Search%20plan%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "research-skills-check-1",
              "prompt": "What is one sign that a source may not be reliable?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "research-skills-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "research",
              "acceptedAnswers": [
                "research",
                "skills"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "research-skills-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "integrating-sources",
        "title": "Integrating Sources",
        "description": "Paraphrase and summarize external ideas without losing your own voice or control of the argument.",
        "duration": "18 min",
        "video": {
          "label": "Video placeholder: source integration",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Rewrite one source sentence as a paraphrase and one as a summary.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "paraphrase-guide-1",
            "title": "Paraphrase guide",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Paraphrase%20guide%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "citation-examples-2",
            "title": "Citation examples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Citation%20examples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "integrating-sources-check-1",
              "prompt": "What is the main goal of paraphrasing?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "integrating-sources-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "integrating",
              "acceptedAnswers": [
                "integrating",
                "sources"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "integrating-sources-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "citation-integrity",
        "title": "Citation and Academic Integrity",
        "description": "Use APA and MLA basics, avoid plagiarism, and keep a clean academic trail.",
        "duration": "21 min",
        "video": {
          "label": "Video placeholder: citations and integrity",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Format two references in either APA or MLA style.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "citation-cheat-sheet-1",
            "title": "Citation cheat sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Citation%20cheat%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "integrity-checklist-2",
            "title": "Integrity checklist",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Integrity%20checklist%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "citation-integrity-check-1",
              "prompt": "Why do citations matter in academic writing?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "citation-integrity-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "citation",
              "acceptedAnswers": [
                "citation",
                "academic",
                "integrity"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "citation-integrity-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "academic-listening",
        "title": "Academic Listening",
        "description": "Follow lecture structure, capture key ideas, and build notes that you can reuse later.",
        "duration": "17 min",
        "video": {
          "label": "Video placeholder: lecture listening",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Take Cornell notes from a short lecture clip.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "lecture-notes-template-1",
            "title": "Lecture notes template",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Lecture%20notes%20template%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "cornell-sheet-2",
            "title": "Cornell sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Cornell%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "academic-listening-check-1",
              "prompt": "What should you record first when listening to a lecture?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "academic-listening-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "academic",
              "acceptedAnswers": [
                "academic",
                "listening"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "academic-listening-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "academic-speaking",
        "title": "Academic Speaking",
        "description": "Join seminars, build arguments, and disagree respectfully while staying clear and precise.",
        "duration": "16 min",
        "video": {
          "label": "Video placeholder: seminar speaking",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Write three seminar responses, including one respectful disagreement.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "discussion-prompts-1",
            "title": "Discussion prompts",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Discussion%20prompts%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "speaking-rubric-2",
            "title": "Speaking rubric",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Speaking%20rubric%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "academic-speaking-check-1",
              "prompt": "What makes a seminar response academically strong?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "academic-speaking-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "academic",
              "acceptedAnswers": [
                "academic",
                "speaking"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "academic-speaking-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "presentation-skills",
        "title": "Presentation Skills",
        "description": "Plan a short oral report, use visuals well, and practice confident delivery.",
        "duration": "19 min",
        "video": {
          "label": "Video placeholder: presentation practice",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Outline a three-slide presentation with one key message per slide.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "slide-plan-1",
            "title": "Slide plan",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Slide%20plan%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "presentation-checklist-2",
            "title": "Presentation checklist",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Presentation%20checklist%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "presentation-skills-check-1",
              "prompt": "What should visual material do in a presentation?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "presentation-skills-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "presentation",
              "acceptedAnswers": [
                "presentation",
                "skills"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "presentation-skills-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "academic-communication",
        "title": "Academic Communication",
        "description": "Write formal emails to teachers and university offices with the right tone and structure.",
        "duration": "15 min",
        "video": {
          "label": "Video placeholder: formal communication",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Draft a formal email asking for academic advice or clarification.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "email-template-1",
            "title": "Email template",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Email%20template%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "tone-guide-2",
            "title": "Tone guide",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Tone%20guide%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "academic-communication-check-1",
              "prompt": "What makes an academic email sound professional?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "academic-communication-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "academic",
              "acceptedAnswers": [
                "academic",
                "communication"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "academic-communication-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      }
    ],
    "enrollmentSettings": {
      "isOpen": true,
      "requiresApproval": false,
      "capacity": null,
      "adminEditable": true
    }
  },
  {
    "id": "preview-physics-basics",
    "track": "Mentoria Physics",
    "title": "Physics Basics",
    "description": "Kinematics, dynamics, statics, and mechanics modeling for school science and competitions.",
    "difficulty": "Beginner",
    "tags": [
      "stem",
      "science",
      "physics",
      "mechanics"
    ],
    "progress": 38,
    "lessons": [
      {
        "id": "forces-models",
        "title": "Introduction to Physics and the Scientific Method",
        "description": "Frame physics as measurement, modeling, and testing instead of memorizing formulas too early.",
        "duration": "18 min",
        "video": {
          "label": "Video placeholder: scientific method in physics",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Write one hypothesis and one testable observation for a motion problem.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "science-method-notes-1",
            "title": "Science method notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Science%20method%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "observation-sheet-2",
            "title": "Observation sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Observation%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "forces-models-check-1",
              "prompt": "What is the purpose of a scientific hypothesis?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "forces-models-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "introduction",
              "acceptedAnswers": [
                "introduction",
                "physics",
                "scientific",
                "method"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "forces-models-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "newtons-second-law",
        "title": "Newton's Laws and Dynamics",
        "description": "Use Newton's laws to connect net force, mass, and acceleration in real systems.",
        "duration": "24 min",
        "video": {
          "label": "Video placeholder: Newton's laws",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Solve three dynamics problems and explain how the net force changed.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "force-diagram-sheet-1",
            "title": "Force diagram sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Force%20diagram%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "worked-examples-2",
            "title": "Worked examples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Worked%20examples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "newtons-second-law-check-1",
              "prompt": "What happens to acceleration when net force increases?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "newtons-second-law-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "newton",
              "acceptedAnswers": [
                "newton",
                "laws",
                "dynamics"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "newtons-second-law-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "measurement-units",
        "title": "Measurement, Units, and Significant Figures",
        "description": "Use SI units, conversions, and precision rules to keep calculations clean.",
        "duration": "17 min",
        "video": {
          "label": "Video placeholder: units and precision",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Convert three measurements and round them to the correct significant figures.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "unit-table-1",
            "title": "Unit table",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Unit%20table%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "precision-practice-2",
            "title": "Precision practice",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Precision%20practice%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "measurement-units-check-1",
              "prompt": "Why do significant figures matter in physics?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "measurement-units-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "measurement",
              "acceptedAnswers": [
                "measurement",
                "units",
                "significant",
                "figures"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "measurement-units-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "scalars-vectors-motion",
        "title": "Scalars, Vectors, and 1D Motion",
        "description": "Separate direction from size and use it to describe position and displacement correctly.",
        "duration": "19 min",
        "video": {
          "label": "Video placeholder: scalars and vectors",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Classify eight quantities as scalar or vector.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "vector-sketch-sheet-1",
            "title": "Vector sketch sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Vector%20sketch%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "1d-motion-examples-2",
            "title": "1D motion examples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,1D%20motion%20examples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "scalars-vectors-motion-check-1",
              "prompt": "Which quantity includes direction?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "scalars-vectors-motion-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "scalars",
              "acceptedAnswers": [
                "scalars",
                "vectors",
                "motion"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "scalars-vectors-motion-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "speed-velocity-acceleration",
        "title": "Speed, Velocity, and Acceleration",
        "description": "Build the core kinematics language for how motion changes over time.",
        "duration": "21 min",
        "video": {
          "label": "Video placeholder: speed and acceleration",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Solve three motion problems using speed, velocity, and acceleration.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "formula-sheet-1",
            "title": "Formula sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Formula%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "motion-exercises-2",
            "title": "Motion exercises",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Motion%20exercises%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "speed-velocity-acceleration-check-1",
              "prompt": "What does acceleration measure?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "speed-velocity-acceleration-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "speed",
              "acceptedAnswers": [
                "speed",
                "velocity",
                "acceleration"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "speed-velocity-acceleration-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "motion-graphs",
        "title": "Motion Graphs and Kinematics Equations",
        "description": "Read and create distance-time and velocity-time graphs, then connect them to equations.",
        "duration": "23 min",
        "video": {
          "label": "Video placeholder: motion graphs",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Interpret two graphs and calculate one missing value from each.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "graph-workbook-1",
            "title": "Graph workbook",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Graph%20workbook%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "equation-reference-2",
            "title": "Equation reference",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Equation%20reference%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "motion-graphs-check-1",
              "prompt": "What does the slope of a distance-time graph show?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "motion-graphs-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "motion",
              "acceptedAnswers": [
                "motion",
                "graphs",
                "kinematics",
                "equations"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "motion-graphs-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "free-body-diagrams",
        "title": "Free-Body Diagrams and Resultant Force",
        "description": "Draw forces clearly before solving any mechanics problem.",
        "duration": "18 min",
        "video": {
          "label": "Video placeholder: free-body diagrams",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Draw free-body diagrams for three real-world situations.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "fbd-template-1",
            "title": "FBD template",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,FBD%20template%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "force-cards-2",
            "title": "Force cards",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Force%20cards%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "free-body-diagrams-check-1",
              "prompt": "Why is a free-body diagram useful before calculation?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "free-body-diagrams-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "free",
              "acceptedAnswers": [
                "free",
                "body",
                "diagrams",
                "resultant"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "free-body-diagrams-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "friction-drag-circular-motion",
        "title": "Friction, Drag, and Circular Motion",
        "description": "Model resistive forces and the role of inward force in curved motion.",
        "duration": "20 min",
        "video": {
          "label": "Video placeholder: friction and drag",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Compare a friction problem and a circular motion problem in one page.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "force-notes-1",
            "title": "Force notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Force%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "circular-motion-examples-2",
            "title": "Circular motion examples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Circular%20motion%20examples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "friction-drag-circular-motion-check-1",
              "prompt": "Which force is needed to keep an object moving in a circle?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "friction-drag-circular-motion-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "friction",
              "acceptedAnswers": [
                "friction",
                "drag",
                "circular",
                "motion"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "friction-drag-circular-motion-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "energy-methods",
        "title": "Work, Energy, Power, and Efficiency",
        "description": "Switch between force and energy methods to solve mechanics problems more efficiently.",
        "duration": "22 min",
        "video": {
          "label": "Video placeholder: energy methods",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Solve one problem with forces and again with energy methods.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "energy-notes-1",
            "title": "Energy notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Energy%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "worked-examples-2",
            "title": "Worked examples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Worked%20examples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "energy-methods-check-1",
              "prompt": "When is energy the cleaner method to use?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "energy-methods-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "work",
              "acceptedAnswers": [
                "work",
                "energy",
                "power",
                "efficiency"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "energy-methods-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "momentum-impulse",
        "title": "Momentum and Impulse",
        "description": "Track how motion changes during collisions and short interactions.",
        "duration": "19 min",
        "video": {
          "label": "Video placeholder: momentum and impulse",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Calculate momentum before and after a short collision.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "momentum-sheet-1",
            "title": "Momentum sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Momentum%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "collision-practice-2",
            "title": "Collision practice",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Collision%20practice%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "momentum-impulse-check-1",
              "prompt": "What is impulse equal to?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "momentum-impulse-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "momentum",
              "acceptedAnswers": [
                "momentum",
                "impulse"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "momentum-impulse-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "moments-torque",
        "title": "Moments, Torque, and Rotational Balance",
        "description": "Use turning effects to study beams, levers, and balanced systems.",
        "duration": "21 min",
        "video": {
          "label": "Video placeholder: torque and balance",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Find the turning effect of three forces around a pivot.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "lever-diagram-1",
            "title": "Lever diagram",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Lever%20diagram%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "moments-worksheet-2",
            "title": "Moments worksheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Moments%20worksheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "moments-torque-check-1",
              "prompt": "What is the moment of a force?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "moments-torque-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "moments",
              "acceptedAnswers": [
                "moments",
                "torque",
                "rotational",
                "balance"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "moments-torque-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "static-equilibrium",
        "title": "Static Equilibrium and Center of Mass",
        "description": "Explain when a system is stable, balanced, and not rotating.",
        "duration": "18 min",
        "video": {
          "label": "Video placeholder: equilibrium",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Mark the center of mass on three objects and explain stability.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "balance-examples-1",
            "title": "Balance examples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Balance%20examples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "center-of-mass-notes-2",
            "title": "Center of mass notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Center%20of%20mass%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "static-equilibrium-check-1",
              "prompt": "What conditions must be met for static equilibrium?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "static-equilibrium-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "static",
              "acceptedAnswers": [
                "static",
                "equilibrium",
                "center",
                "mass"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "static-equilibrium-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "pressure-density-fluids",
        "title": "Pressure, Density, and Mechanical Fluids",
        "description": "Connect pressure, density, and fluid behavior in everyday mechanical systems.",
        "duration": "20 min",
        "video": {
          "label": "Video placeholder: fluids and pressure",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Compare pressure in two different situations using one formula.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "pressure-chart-1",
            "title": "Pressure chart",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Pressure%20chart%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "fluid-examples-2",
            "title": "Fluid examples",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Fluid%20examples%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "pressure-density-fluids-check-1",
              "prompt": "How does pressure change when the same force acts on a smaller area?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "pressure-density-fluids-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "pressure",
              "acceptedAnswers": [
                "pressure",
                "density",
                "mechanical",
                "fluids"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "pressure-density-fluids-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "mixed-mechanics-review",
        "title": "Mixed Mechanics Review and Problem Solving",
        "description": "Pull the entire mechanics track together with mixed questions and method choice.",
        "duration": "26 min",
        "video": {
          "label": "Video placeholder: mechanics review",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Solve a mixed mechanics set and label the topic used for each answer.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "review-set-1",
            "title": "Review set",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Review%20set%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "formula-summary-2",
            "title": "Formula summary",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Formula%20summary%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "mixed-mechanics-review-check-1",
              "prompt": "What is the first step in solving a mixed mechanics problem?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "mixed-mechanics-review-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "mixed",
              "acceptedAnswers": [
                "mixed",
                "mechanics",
                "review",
                "problem"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "mixed-mechanics-review-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      }
    ],
    "enrollmentSettings": {
      "isOpen": true,
      "requiresApproval": false,
      "capacity": null,
      "adminEditable": true
    }
  },
  {
    "id": "preview-biology-basics",
    "track": "Mentoria Biology",
    "title": "Biology Basics",
    "description": "Cells, genetics, evolution, and ecology in a 14-lesson school biology curriculum.",
    "difficulty": "Beginner",
    "tags": [
      "stem",
      "science",
      "biology"
    ],
    "progress": 31,
    "lessons": [
      {
        "id": "intro-biology-scientific-method",
        "title": "Introduction to Biology and the Scientific Method",
        "description": "Define life, frame a question, and use evidence to build a scientific explanation.",
        "duration": "18 min",
        "video": {
          "label": "Video placeholder: scientific method in biology",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Write one hypothesis and one testable prediction.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "method-notes-1",
            "title": "Method notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Method%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "hypothesis-sheet-2",
            "title": "Hypothesis sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Hypothesis%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "intro-biology-scientific-method-check-1",
              "prompt": "What is the role of a hypothesis?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "intro-biology-scientific-method-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "introduction",
              "acceptedAnswers": [
                "introduction",
                "biology",
                "scientific",
                "method"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "intro-biology-scientific-method-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "chemical-basis-life",
        "title": "Chemical Basis of Life",
        "description": "Review water properties and the macromolecules that build living systems.",
        "duration": "22 min",
        "video": {
          "label": "Video placeholder: chemical basis of life",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Match each macromolecule to one of its core functions.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "biomolecule-chart-1",
            "title": "Biomolecule chart",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Biomolecule%20chart%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "water-notes-2",
            "title": "Water notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Water%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "chemical-basis-life-check-1",
              "prompt": "Which macromolecule stores genetic information?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "chemical-basis-life-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "chemical",
              "acceptedAnswers": [
                "chemical",
                "basis",
                "life"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "chemical-basis-life-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "cell-theory-structure",
        "title": "Cell Theory and Structure",
        "description": "Learn the main ideas of cell theory and compare prokaryotic and eukaryotic cells.",
        "duration": "19 min",
        "video": {
          "label": "Video placeholder: cell theory",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Compare a prokaryotic and eukaryotic cell in a table.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "cell-comparison-sheet-1",
            "title": "Cell comparison sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Cell%20comparison%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "theory-notes-2",
            "title": "Theory notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Theory%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "cell-theory-structure-check-1",
              "prompt": "What does cell theory say about living things?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "cell-theory-structure-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "cell",
              "acceptedAnswers": [
                "cell",
                "theory",
                "structure"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "cell-theory-structure-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "cell-organelles",
        "title": "Cell Organelles",
        "description": "Connect each organelle to its job inside the cell.",
        "duration": "20 min",
        "video": {
          "label": "Video placeholder: organelles",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Label a cell diagram and explain five organelle functions.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "organelle-cards-1",
            "title": "Organelle cards",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Organelle%20cards%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "cell-diagram-2",
            "title": "Cell diagram",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Cell%20diagram%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "cell-organelles-check-1",
              "prompt": "Which organelle makes most ATP in eukaryotic cells?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "cell-organelles-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "cell",
              "acceptedAnswers": [
                "cell",
                "organelles"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "cell-organelles-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "cellular-transport",
        "title": "Cellular Transport",
        "description": "Use membrane structure to explain diffusion, osmosis, and active transport.",
        "duration": "21 min",
        "video": {
          "label": "Video placeholder: membrane transport",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Predict the direction of movement in three transport examples.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "membrane-notes-1",
            "title": "Membrane notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Membrane%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "transport-scenarios-2",
            "title": "Transport scenarios",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Transport%20scenarios%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "cellular-transport-check-1",
              "prompt": "What is the difference between passive and active transport?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "cellular-transport-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "cellular",
              "acceptedAnswers": [
                "cellular",
                "transport"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "cellular-transport-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "cell-cycle-mitosis",
        "title": "Cell Cycle and Mitosis",
        "description": "Follow the cell cycle and the stages of somatic cell division.",
        "duration": "23 min",
        "video": {
          "label": "Video placeholder: mitosis",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Put the stages of mitosis in order and describe each one.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "mitosis-diagram-1",
            "title": "Mitosis diagram",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Mitosis%20diagram%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "cycle-notes-2",
            "title": "Cycle notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Cycle%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "cell-cycle-mitosis-check-1",
              "prompt": "What happens during mitosis?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "cell-cycle-mitosis-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "cell",
              "acceptedAnswers": [
                "cell",
                "cycle",
                "mitosis"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "cell-cycle-mitosis-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "photosynthesis",
        "title": "Energy Metabolism: Photosynthesis",
        "description": "Explain how plants convert light energy into chemical energy.",
        "duration": "20 min",
        "video": {
          "label": "Video placeholder: photosynthesis",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Label the inputs and outputs of photosynthesis.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "photosynthesis-chart-1",
            "title": "Photosynthesis chart",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Photosynthesis%20chart%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "chloroplast-notes-2",
            "title": "Chloroplast notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Chloroplast%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "photosynthesis-check-1",
              "prompt": "Why is chlorophyll important?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "photosynthesis-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "energy",
              "acceptedAnswers": [
                "energy",
                "metabolism",
                "photosynthesis"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "photosynthesis-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "cellular-respiration",
        "title": "Energy Metabolism: Cellular Respiration",
        "description": "Track glycolysis, the Krebs cycle, electron transport, and ATP synthesis.",
        "duration": "24 min",
        "video": {
          "label": "Video placeholder: cellular respiration",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Map the main stages of respiration in the correct order.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "respiration-pathway-1",
            "title": "Respiration pathway",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Respiration%20pathway%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "atp-notes-2",
            "title": "ATP notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,ATP%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "cellular-respiration-check-1",
              "prompt": "What is the main purpose of cellular respiration?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "cellular-respiration-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "energy",
              "acceptedAnswers": [
                "energy",
                "metabolism",
                "cellular",
                "respiration"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "cellular-respiration-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "meiosis-gamete-formation",
        "title": "Meiosis and Gamete Formation",
        "description": "See how sex cells are formed and why crossing over increases diversity.",
        "duration": "22 min",
        "video": {
          "label": "Video placeholder: meiosis",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Compare mitosis and meiosis in one chart.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "meiosis-chart-1",
            "title": "Meiosis chart",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Meiosis%20chart%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "variation-notes-2",
            "title": "Variation notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Variation%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "meiosis-gamete-formation-check-1",
              "prompt": "Why is meiosis important for genetic diversity?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "meiosis-gamete-formation-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "meiosis",
              "acceptedAnswers": [
                "meiosis",
                "gamete",
                "formation"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "meiosis-gamete-formation-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "fundamentals-genetics",
        "title": "Fundamentals of Genetics",
        "description": "Use Mendel's laws, dominant and recessive alleles, and simple crosses.",
        "duration": "21 min",
        "video": {
          "label": "Video placeholder: Mendelian genetics",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Solve three monohybrid crosses.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "punnett-square-sheet-1",
            "title": "Punnett square sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Punnett%20square%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "inheritance-notes-2",
            "title": "Inheritance notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Inheritance%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "fundamentals-genetics-check-1",
              "prompt": "What does a dominant allele do?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "fundamentals-genetics-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "fundamentals",
              "acceptedAnswers": [
                "fundamentals",
                "genetics"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "fundamentals-genetics-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "molecular-genetics",
        "title": "Molecular Genetics",
        "description": "Describe DNA structure and the flow of information through replication, transcription, and translation.",
        "duration": "23 min",
        "video": {
          "label": "Video placeholder: molecular genetics",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Label the steps from DNA to protein in order.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "dna-model-1",
            "title": "DNA model",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,DNA%20model%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "protein-synthesis-notes-2",
            "title": "Protein synthesis notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Protein%20synthesis%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "molecular-genetics-check-1",
              "prompt": "What is the role of transcription?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "molecular-genetics-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "molecular",
              "acceptedAnswers": [
                "molecular",
                "genetics"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "molecular-genetics-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "evolution-theory",
        "title": "Theory of Evolution",
        "description": "Understand natural selection, microevolution, and the formation of new species.",
        "duration": "20 min",
        "video": {
          "label": "Video placeholder: evolution",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Explain one example of natural selection in a short paragraph.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "evolution-timeline-1",
            "title": "Evolution timeline",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Evolution%20timeline%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          },
          {
            "id": "selection-notes-2",
            "title": "Selection notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Selection%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "evolution-theory-check-1",
              "prompt": "What is natural selection?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "evolution-theory-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "theory",
              "acceptedAnswers": [
                "theory",
                "evolution"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "evolution-theory-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "ecology-fundamentals",
        "title": "Fundamentals of Ecology",
        "description": "Follow ecological levels, populations, food chains, and energy transfer.",
        "duration": "19 min",
        "video": {
          "label": "Video placeholder: ecology",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Build one food chain and one food web from the same habitat.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "food-web-sheet-1",
            "title": "Food web sheet",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Food%20web%20sheet%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "population-graph-2",
            "title": "Population graph",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Population%20graph%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "ecology-fundamentals-check-1",
              "prompt": "Where does energy move in an ecosystem?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "ecology-fundamentals-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "fundamentals",
              "acceptedAnswers": [
                "fundamentals",
                "ecology"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "ecology-fundamentals-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      },
      {
        "id": "human-impact-biosphere",
        "title": "Human Impact on the Biosphere",
        "description": "Track carbon and nitrogen cycles and the human effects on climate and biodiversity.",
        "duration": "22 min",
        "video": {
          "label": "Video placeholder: human impact on biosphere",
          "sourceType": "external",
          "adminEditable": true
        },
        "assignment": {
          "prompt": "Name two human activities that alter an ecosystem.",
          "acceptsFiles": true,
          "acceptedFileTypes": [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
            ".png",
            ".jpg",
            ".jpeg"
          ],
          "maxFileSizeMb": 10,
          "submitLabel": "Submit assignment",
          "adminEditable": true
        },
        "materials": [
          {
            "id": "cycle-diagram-1",
            "title": "Cycle diagram",
            "description": "Downloadable lesson material",
            "kind": "download",
            "url": "data:text/plain;charset=utf-8,Cycle%20diagram%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": true,
            "adminEditable": true
          },
          {
            "id": "impact-notes-2",
            "title": "Impact notes",
            "description": "Lesson reference",
            "kind": "document",
            "url": "data:text/plain;charset=utf-8,Impact%20notes%0A%0AThis%20Mentoria%20lesson%20material%20slot%20is%20ready%20for%20an%20admin-uploaded%20file.",
            "downloadable": false,
            "adminEditable": true
          }
        ],
        "selfCheck": {
          "questions": [
            {
              "id": "human-impact-biosphere-check-1",
              "prompt": "Which cycle is strongly affected by fossil fuel use?",
              "type": "radio",
              "options": [
                "Use the lesson idea and evidence",
                "Choose the longest answer without checking",
                "Skip the question and move on"
              ],
              "correctAnswer": "Use the lesson idea and evidence",
              "feedback": {
                "correct": "Correct. This answer uses the lesson idea with evidence.",
                "incorrect": "Review the lesson idea, then choose the answer grounded in evidence."
              }
            },
            {
              "id": "human-impact-biosphere-check-2",
              "prompt": "Type one keyword from this lesson title.",
              "type": "text",
              "correctAnswer": "human",
              "acceptedAnswers": [
                "human",
                "impact",
                "biosphere"
              ],
              "feedback": {
                "correct": "Correct. That keyword connects to the lesson focus.",
                "incorrect": "Look back at the lesson title and type one important keyword."
              }
            },
            {
              "id": "human-impact-biosphere-check-3",
              "prompt": "What is the best next step after this self-check?",
              "type": "radio",
              "options": [
                "Review feedback, then submit or revise the assignment",
                "Ignore the assignment prompt",
                "Close the lesson without practice"
              ],
              "correctAnswer": "Review feedback, then submit or revise the assignment",
              "feedback": {
                "correct": "Correct. Use the check result to submit or revise your work.",
                "incorrect": "Use the check result as feedback before moving on."
              }
            }
          ],
          "scoreComments": {
            "0": "Review the lesson once more, then try the check again with the materials open.",
            "1": "You have one solid point. Revisit the weak spots before submitting your assignment.",
            "2": "Good progress. One more careful pass should make the lesson feel stable.",
            "3": "Strong check. You are ready to submit the assignment or move to the next lesson."
          },
          "adminEditable": true
        },
        "mentorLMNoteConfig": {
          "enabled": true,
          "allowStudentSave": true,
          "adminEditable": true
        }
      }
    ],
    "enrollmentSettings": {
      "isOpen": true,
      "requiresApproval": false,
      "capacity": null,
      "adminEditable": true
    }
  }
];

export const previewOpportunities: Opportunity[] = [
  {
    "id": "preview-almaty-physics-battles",
    "title": "Almaty Physics Battles 2026",
    "category": "Competition",
    "direction": "STEM",
    "format": "Hybrid",
    "deadline": "2026-07-08",
    "grades": [
      "9",
      "10",
      "11",
      "12"
    ],
    "location": "Kazakhstan",
    "description": "An international team-based physics competition for secondary school students, held in Almaty with online selection stages.",
    "requirements": "Team registration, physics problem solving, and mentor-supported preparation.",
    "tags": [
      "stem",
      "science",
      "competition",
      "hybrid",
      "kazakhstan",
      "research"
    ],
    "applyUrl": "https://example.com/almaty-physics-battles"
  },
  {
    "id": "preview-iypt-2026",
    "title": "International Young Physicists' Tournament 2026",
    "category": "Competition",
    "direction": "Science",
    "format": "Offline",
    "deadline": "2026-07-12",
    "grades": [
      "10",
      "11",
      "12"
    ],
    "location": "Global",
    "description": "A team-based physics tournament with research, experiments, and scientific discussion.",
    "requirements": "Strong physics background, research presentation, and national selection pathway.",
    "tags": [
      "stem",
      "science",
      "competition",
      "offline",
      "global",
      "research"
    ],
    "applyUrl": "https://www.iypt.org/"
  },
  {
    "id": "preview-beamline-for-schools",
    "title": "Beamline for Schools 2026",
    "category": "Research",
    "direction": "Science",
    "format": "Online",
    "deadline": "2026-08-18",
    "grades": [
      "9",
      "10",
      "11",
      "12"
    ],
    "location": "Global",
    "description": "A CERN, DESY, and ELSA physics proposal competition where high-school teams design an accelerator experiment.",
    "requirements": "Experiment proposal, teacher support, and a small student research team.",
    "tags": [
      "stem",
      "science",
      "research",
      "competition",
      "online",
      "global"
    ],
    "applyUrl": "https://beamline-for-schools.web.cern.ch/"
  },
  {
    "id": "preview-online-physics-olympiad",
    "title": "Online Physics Olympiad Invitational 2026",
    "category": "Competition",
    "direction": "STEM",
    "format": "Online",
    "deadline": "2026-08-30",
    "grades": [
      "8",
      "9",
      "10",
      "11"
    ],
    "location": "Global",
    "description": "An online contest pathway with an invitational round and international participation from physics students.",
    "requirements": "Individual registration, olympiad practice, and timed online problem solving.",
    "tags": [
      "stem",
      "science",
      "competition",
      "online",
      "global"
    ],
    "applyUrl": "https://example.com/physics-olympiad"
  }
];
