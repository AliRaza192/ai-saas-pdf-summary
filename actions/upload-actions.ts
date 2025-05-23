// "use server";

// import { getDbConnection } from "@/lib/db";
// import { generateSummaryFromGemini } from "@/lib/geminiai";
// import { fetchAndExtractPdfText } from "@/lib/langchain";
// import { generateSummaryFromOpenAI } from "@/lib/openai";
// import { formatFileNameAsTitle } from "@/utils/format-utils";
// import { auth } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";

// interface PdfSummaryType {
//   userId?: string;
//   fileUrl: string;
//   summary: string;
//   title: string;
//   fileName: string;
// }

// // export async function generatePdfText({ fileUrl }: { fileUrl: string }) {
// //   if (!fileUrl) {
// //     return {
// //       success: false,
// //       message: "File upload failed!",
// //       data: null,
// //     };
// //   }

// //   try {
// //     const pdfText = await fetchAndExtractPdfText(fileUrl);
// //     console.log("PDF text extracted, length:", pdfText?.length || 0);

// //     if (!pdfText) {
// //       return {
// //         success: false,
// //         message: "Failed to fetch and extract PDF text!",
// //         data: null,
// //       };
// //     }

// //     return {
// //       success: true,
// //       message: "PDF text fetched successfully!",
// //       data: {
// //         pdfText,
// //       },
// //     };
// //   } catch (err) {
// //     console.error("Error in generatePdfText:", err);
// //     return {
// //       success: false,
// //       message: "Failed to fetch and extract PDF text!",
// //       data: null,
// //     };
// //   }
// // }

// export async function generatePdfText({ fileUrl }: { fileUrl: string }) {
//   if (!fileUrl) {
//     console.log("storePdfSummaryAction received fileUrl:", fileUrl);

//     console.error("🚫 No file URL provided to generatePdfText");
//     return {
//       success: false,
//       message: "File upload failed!",
//       data: null,
//     };
//   }

//   try {
//     console.log("🔍 Fetching and extracting PDF text for URL:", fileUrl);
//     const pdfText = await fetchAndExtractPdfText(fileUrl);
//     console.log("✅ Extracted PDF Text Length:", pdfText?.length);

//     if (!pdfText) {
//       return {
//         success: false,
//         message: "Failed to fetch and extract PDF text!",
//         data: null,
//       };
//     }

//     return {
//       success: true,
//       message: "PDF text fetched successfully!",
//       data: { pdfText },
//     };
//   } catch (err) {
//     console.error("❌ Error extracting PDF text:", err);
//     return {
//       success: false,
//       message: "Failed to fetch and extract PDF text!",
//       data: null,
//     };
//   }
// }

// // export async function generatePdfSummary({
// //   pdfText,
// //   fileName,
// // }: {
// //   pdfText: string;
// //   fileName: string;
// // }) {
// //   try {
// //     let summary;

// //     try {
// //       console.log("Trying OpenAI for summary generation");
// //       summary = await generateSummaryFromOpenAI(pdfText);
// //       console.log("OpenAI summary generated successfully");
// //     } catch (error) {
// //       console.log("OpenAI summary generation failed:", error);

// //       if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
// //         console.log("OpenAI rate limit exceeded, trying Gemini");
// //         try {
// //           summary = await generateSummaryFromGemini(pdfText);
// //           console.log("Gemini summary generated successfully");
// //         } catch (geminiError) {
// //           console.error("Gemini API failed after OpenAI quote exceeded", geminiError);
// //           return {
// //             success: false,
// //             message: "Failed to generate summary with available AI providers",
// //             data: null,
// //           };
// //         }
// //       } else {
// //         return {
// //           success: false,
// //           message: "Failed to generate summary!",
// //           data: null,
// //         };
// //       }
// //     }

// //     if (!summary) {
// //       return {
// //         success: false,
// //         message: "Failed to generate summary!",
// //         data: null,
// //       };
// //     }

// //     return {
// //       success: true,
// //       message: "Summary generated successfully!",
// //       data: {
// //         title: fileName,
// //         summary,
// //       },
// //     };
// //   } catch (err) {
// //     console.error("Unexpected error in generatePdfSummary:", err);
// //     return {
// //       success: false,
// //       message: "Failed to generate summary!",
// //       data: null,
// //     };
// //   }
// // }

// export async function generatePdfSummary({
//   pdfText,
//   fileName,
// }: {
//   pdfText: string;
//   fileName: string;
// }) {
//   try {
//     console.log("🧠 Generating summary with OpenAI...");
//     let summary;

//     try {
//       summary = await generateSummaryFromOpenAI(pdfText);
//       console.log("✅ Summary from OpenAI:", summary);
//     } catch (error) {
//       console.warn("⚠️ OpenAI failed, trying Gemini. Error:", error);

//       if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
//         try {
//           summary = await generateSummaryFromGemini(pdfText);
//           console.log("✅ Summary from Gemini:", summary);
//         } catch (geminiError) {
//           console.error("❌ Gemini also failed:", geminiError);
//           throw new Error(
//             "Failed to generate summary with available AI providers"
//           );
//         }
//       } else {
//         return {
//           success: false,
//           message: "Failed to generate summary!",
//           data: null,
//         };
//       }
//     }

//     if (!summary) {
//       console.error("❌ Summary is empty");
//       return {
//         success: false,
//         message: "Failed to generate summary!",
//         data: null,
//       };
//     }

//     return {
//       success: true,
//       message: "Summary generated successfully!",
//       data: {
//         title: fileName,
//         summary,
//       },
//     };
//   } catch (err) {
//     console.error("❌ Error generating summary:", err);
//     return {
//       success: false,
//       message: "Failed to generate summary!",
//       data: null,
//     };
//   }
// }

// async function savePdfSummary({
//   userId,
//   fileUrl,
//   summary,
//   title,
//   fileName,
// }: PdfSummaryType) {
//   try {
//     console.log("Saving PDF with URL:", fileUrl);

//     const sql = await getDbConnection();
//     const [savedSummary] = await sql`
//             INSERT INTO pdf_summaries (
//                 user_id,
//                 original_file_url,
//                 summary_text,
//                 title,
//                 file_name
//             ) VALUES (
//                 ${userId},
//                 ${fileUrl},
//                 ${summary},
//                 ${title},
//                 ${fileName}
//             )RETURNING id, summary_text`;

//     return savedSummary;
//   } catch (error) {
//     console.error("Error saving PDF summary", error);
//     throw error;
//   }
// }

// export async function storePdfSummaryAction({
//   fileUrl,
//   summary,
//   title,
//   fileName,
// }: PdfSummaryType) {
//   let savedSummary: any;

//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return {
//         success: false,
//         message: "User not found!",
//       };
//     }

//     savedSummary = await savePdfSummary({
//       userId: userId,
//       fileUrl,
//       summary,
//       title,
//       fileName,
//     });

//     if (!savedSummary) {
//       return {
//         success: false,
//         message: "Failed to save PDF summary, Please try again...",
//       };
//     }
//   } catch (error) {
//     console.error("Error in storePdfSummaryAction:", error);
//     return {
//       success: false,
//       message:
//         error instanceof Error ? error.message : "Error saving PDF summary!",
//     };
//   }

//   // Revalidate our cache
//   revalidatePath(`/summaries/${savedSummary.id}`);

//   return {
//     success: true,
//     message: "PDF summary saved successfully!",
//     data: {
//       id: savedSummary.id,
//     },
//   };
// }

"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfText({ fileUrl }: { fileUrl: string }) {
  if (!fileUrl) {
    return {
      success: false,
      message: "File upload failed!",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(fileUrl);
    console.log({ pdfText });

    if (!pdfText) {
      return {
        success: false,
        message: "Failed to fetch and extract PDF text!",
        data: null,
      };
    }

    return {
      success: true,
      message: "PDF text fetched successfully!",
      data: {
        pdfText,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to fetch and extract PDF text!",
      data: null,
    };
  }
}

// export async function generatePdfSummary({
//   pdfText,
//   fileName,
// }: {
//   pdfText: string;
//   fileName: string;
// }) {
//   try {
//     let summary;
//     try {
//       summary = await generateSummaryFromOpenAI(pdfText);
//       console.log({ summary });
//     } catch (error) {
//       console.log(error);

//       //  call gemini
//       if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
//         try {
//           summary = await generateSummaryFromGemini(pdfText);
//         } catch (geminiError) {
//           console.error(
//             "Gemini API failed after OpenAI quote exceeded",
//             geminiError
//           );
//           throw new Error(
//             "Failed to generate summary with available AI providers"
//           );
//         }
//       }
//       return {
//         success: false,
//         message: "Failed to generate summary!",
//         data: null,
//       };
//     }

//     if (!summary) {
//       return {
//         success: false,
//         message: "Failed to generate summary!",
//         data: null,
//       };
//     }

//     return {
//       success: true,
//       message: "Summary generated successfully!",
//       data: {
//         title: fileName,
//         summary,
//       },
//     };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Failed to generate summary!",
//       data: null,
//     };
//   }
// }

// async function savePdfSummary({user_id, fileUrl, summary, title, fileName}: PdfSummaryType) {

//     // sql inserting PDF summary
//     try {
//         const sql = await getDbConnection()
//         await sql  `INSERT INTO pdf_summaries (
//         user_id,
//         original_file_url,
//         summary_text,
//         title,
//         file_name
//     )   VALUES(
//         ${user_id},
//         ${fileUrl},
//         ${summary},
//         ${title},
//         ${fileName}
//     )`

//     } catch (error) {
//         console.error("Error saving PDF summary",error);
//         throw error
//     }
// }

export async function generatePdfSummary({
  pdfText,
  fileName,
}: {
  pdfText: string;
  fileName: string;
}) {
  try {
    let summary;

    // First try OpenAI
    try {
      summary = await generateSummaryFromOpenAI(pdfText);
      console.log({ summary });
    } catch (openAIError) {
      console.log("OpenAI Error:", openAIError);

      // If rate limited, try Gemini
      if (
        openAIError instanceof Error &&
        openAIError.message === "RATE_LIMIT_EXCEEDED"
      ) {
        console.log("Trying Gemini as fallback...");
        try {
          summary = await generateSummaryFromGemini(pdfText);
          console.log("Gemini summary:", summary);
        } catch (geminiError) {
          console.error("Gemini API failed:", geminiError);
          throw new Error(
            "Both OpenAI and Gemini failed to generate summary. Please try again later."
          );
        }
      } else {
        // If not rate limit error, rethrow
        throw openAIError;
      }
    }

    if (!summary) {
      throw new Error(
        "Failed to generate summary - no summary content returned"
      );
    }

    return {
      success: true,
      message: "Summary generated successfully!",
      data: {
        title: fileName,
        summary,
      },
    };
  } catch (err) {
    console.error("Summary generation failed:", err);
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "Failed to generate summary!",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    // Add validation
    if (!fileUrl) {
      throw new Error("File URL is required");
    }

    const sql = await getDbConnection();
    const [savedSummary] = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      ) VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName}
      ) RETURNING id, summary_text`;

    return savedSummary;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}
// export async function storePdfSummaryAction({
//   fileUrl,
//   summary,
//   title,
//   fileName,
// }: PdfSummaryType) {
//   let savedSummary: any;

//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return {
//         success: false,
//         message: "User not found!",
//       };
//     }

//     savedSummary = await savePdfSummary({
//       userId: userId,
//       fileUrl,
//       summary,
//       title,
//       fileName,
//     });

//     if (!savedSummary) {
//       return {
//         success: false,
//         message: "Failed to save PDF summary, Please try again...",
//       };
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message:
//         error instanceof Error ? error.message : "Error saving PDF summary!",
//     };
//   }

//   // Revalidate our cache
//   revalidatePath(`/summaries/${savedSummary.id}`);

//   return {
//     success: true,
//     message: "PDF summary saved successfully!",
//     data: {
//       id: savedSummary.id,
//     },
//   };
// }

interface StorePdfSummaryResult {
  success: boolean;
  message: string;
  data: {
    id?: string;
  } | null;
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType): Promise<StorePdfSummaryResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found!",
        data: null,
      };
    }

    const savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary?.id) {
      return {
        success: false,
        message: "Failed to save PDF summary, Please try again...",
        data: null,
      };
    }

    // Revalidate our cache
    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
      success: true,
      message: "PDF summary saved successfully!",
      data: {
        id: savedSummary.id,
      },
    };
  } catch (error) {
    console.error("Error in storePdfSummaryAction:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary!",
      data: null,
    };
  }
}
