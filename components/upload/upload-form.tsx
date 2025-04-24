"use client";

import {
  generatePdfSummary,
  generatePdfText,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import UploadFormInput from "@/components/upload/upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import LoadingSkeleton from "./loading-skeleton";
import { formatFileNameAsTitle } from "@/utils/format-utils";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File must be less then 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("error occurred while uploading", err);
      toast("Error occurred while uploading", { description: err.message });
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //   try {
    //     setIsLoading(true);
    //     const formData = new FormData(e.currentTarget);
    //     const file = formData.get("file") as File;
    //     console.log(file);

    //     // validation fields

    //     const validationFileds = schema.safeParse({ file });
    //     if (!validationFileds.success) {
    //       toast.error(
    //         "Something went wrong",
    //         {
    //           description:
    //             validationFileds.error.flatten().fieldErrors.file?.[0] ??
    //             "Invalid file",
    //         }
    //         // variant: "destructive",
    //       );
    //       setIsLoading(false);
    //       return;
    //     }

    //     toast.info("Uploading PDF", {
    //       description: "We are uploading your PDF!",
    //     });

    //     // schema with Zod
    //     // upload the file to uploadthing

    //     const uploadResponse = await startUpload([file]);
    //     if (!uploadResponse) {
    //       toast.error(
    //         "Something went wrong",
    //         { description: "Please use a different file!" }
    //         // variant: "destructive",
    //       );
    //       setIsLoading(false);
    //       return;
    //     }

    //     toast.info("Processing PDF", {
    //       description: "Hang tight! We are saving your summary!",
    //     });

    //     const uploadFileUrl = uploadResponse[0].serverData.fileUrl;

    //     let storeResult: any;
    //     toast.info("Generating PDF Summary", {
    //       description: "Hang tight! We are saving your summary!",
    //     });

    //     const formattedFileName = formatFileNameAsTitle(file.name);

    //     console.log("About to call generatePdfText with URL:", uploadFileUrl);
    //     const result = await generatePdfText({
    //       fileUrl: uploadFileUrl,
    //     });
    //     console.log("generatePdfText result:", result);

    //     if (!result?.success || !result?.data?.pdfText) {
    //       toast.error("Failed to extract text from PDF", {
    //         description: "Please try a different PDF file",
    //       });
    //       setIsLoading(false);
    //       return;
    //     }

    //     toast.info("Generating PDF summary", {
    //       description: "Hang tight! Our AI is reading through your document!",
    //     });

    //     // call AI service
    //     // parse the pdf using langchain
    //     console.log(
    //       "About to call generatePdfSummary with text length:",
    //       result.data.pdfText.length
    //     );
    //     const summaryResult = await generatePdfSummary({
    //       pdfText: result.data.pdfText,
    //       fileName: formattedFileName,
    //     });
    //     console.log("generatePdfSummary result:", summaryResult);

    //     if (!summaryResult?.success || !summaryResult?.data?.summary) {
    //       toast.error("Failed to generate summary", {
    //         description:
    //           "Our AI couldn't summarize this document. Please try another file.",
    //       });
    //       setIsLoading(false);
    //       return;
    //     }

    //     toast.info("Saving PDF summary", {
    //       description: "Hang tight! We're saving your summary to the database!",
    //     });

    //     // save the summary to the Neon Database
    //     storeResult = await storePdfSummaryAction({
    //       summary: summaryResult.data.summary,
    //       fileUrl: uploadFileUrl,
    //       title: formattedFileName,
    //       fileName: file.name,
    //     });

    //     console.log("Store Result:", storeResult);

    //     if (!storeResult?.success) {
    //       toast.error("Failed to save summary", {
    //         description: storeResult?.message || "Please try again later",
    //       });
    //       setIsLoading(false);
    //       return;
    //     }

    //     toast.success("Summary Generated!", {
    //       description: "Your PDF successfully summarized and saved!",
    //     });
    //     formRef.current?.reset();
    //     router.push(`summaries/${storeResult.data.id}`);
    //   } catch (error) {
    //     setIsLoading(false);
    //     console.error("Error occurred", error);
    //     toast.error("Something went wrong", {
    //       description:
    //         error instanceof Error ? error.message : "Please try again",
    //     });
    //     formRef.current?.reset();
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      console.log("📥 File selected:", file);

      const validationFileds = schema.safeParse({ file });
      if (!validationFileds.success) {
        console.warn(
          "⚠️ Validation failed:",
          validationFileds.error.flatten().fieldErrors
        );
        toast.error("Something went wrong", {
          description:
            validationFileds.error.flatten().fieldErrors.file?.[0] ??
            "Invalid file",
        });
        setIsLoading(false);
        return;
      }

      console.log("📤 Starting upload...");
      const uploadResponse = await startUpload([file]);

      if (!uploadResponse) {
        console.error("❌ Upload failed, no response received.");
        toast.error("Something went wrong", {
          description: "Please use a different file!",
        });
        setIsLoading(false);
        return;
      }

      const uploadFileUrl = uploadResponse[0].serverData.fileUrl;
      console.log("✅ Upload successful. File URL:", uploadFileUrl);

      const formattedFileName = formatFileNameAsTitle(file.name);
      console.log("📄 Formatted file name:", formattedFileName);

      const result = await generatePdfText({ fileUrl: uploadFileUrl });
      console.log("📝 Extracted PDF Text:", result);

      const summaryResult = await generatePdfSummary({
        pdfText: result?.data?.pdfText ?? "",
        fileName: formattedFileName,
      });
      console.log("🧠 AI Summary Result:", summaryResult);

      const { data = null } = summaryResult || {};

      if (data?.summary) {
        const storeResult = await storePdfSummaryAction({
          summary: data.summary,
          fileUrl: uploadFileUrl,
          title: formattedFileName,
          fileName: file.name,
        });
        console.log("💾 Stored Summary Result:", storeResult);

        toast.success("Summary Generated!", {
          description: "Your PDF successfully summarized and saved!",
        });

        formRef.current?.reset();
        router.push(`summaries/${storeResult.data.id}`);
      }
    } catch (error) {
      console.error("❌ Error during submission:", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute flex inset-0 items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing...
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}
