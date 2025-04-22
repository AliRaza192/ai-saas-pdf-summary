"use client";

import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import UploadFormInput from "@/components/upload/upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import LoadingSkeleton from "./loading-skeleton";

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

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      console.log(file);

      // validation fields

      const validationFileds = schema.safeParse({ file });
      if (!validationFileds.success) {
        toast.error(
          "Something went wrong",
          {
            description:
              validationFileds.error.flatten().fieldErrors.file?.[0] ??
              "Invalid file",
          }
          // variant: "destructive",
        );
        setIsLoading(false);
        return;
      }

      toast.info("Uploading PDF...", {
        description: "We are uploading your PDF!",
      });

      // schema with Zod
      // upload the file to uploadthing

      const response = await startUpload([file]);
      if (!response) {
        toast.error(
          "Something went wrong",
          { description: "Please use a different file!" }
          // variant: "destructive",
        );
        setIsLoading(false);
        return;
      }

      toast.info("Processing PDF...", {
        description: "Hang tight! Our AI is reading through your document!",
      });

      // parse the pdf using langchain
      const result = await generatePdfSummary(response);

      const { data = null, message = null } = result || {};
      if (data) {
        let storeResult: any;
        toast.info("Saving PDF...", {
          description: "Hang tight! We are saving your summary!",
        });

        formRef.current?.reset();

        if (data.summary) {
          // save the summary to the Neon Database
          storeResult = await storePdfSummaryAction({
            summary: data.summary,
            fileUrl: response[0].serverData.file.url,
            title: data.title,
            fileName: file.name,
          });
          console.log("Store Result:", storeResult);

          toast.success("Summary Generated!", {
            description: "Your PDF succesfully summarized and saved!",
          });
          formRef.current?.reset();
          router.push(`summaries/${storeResult.data.id}`);
        }
      }

      //  summarize the pdf using AI
      // redirect to the [id] summary page
    } catch (error) {
      setIsLoading(false);
      console.error("Error occurred", error);
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
