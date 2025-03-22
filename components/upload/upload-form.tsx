"use client"

import { generatePdfSummary } from "@/actions/upload-actions";
import UploadFormInput from "@/components/upload/upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { z } from "zod";


const schema = z.object({
    file: z.instanceof(File, { message: "Invalid file" })
        .refine((file) => file.size <= 20 * 1024 * 1024,
            'File must be less then 20MB')
        .refine((file) => file.type.startsWith('application/pdf'),
            'File must be a PDF')
})

export default function UploadForm() {


    const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
        onClientUploadComplete: () => {
            console.log("uploaded successfully!");
        },
        onUploadError: (err) => {
            console.error("error occurred while uploading", err);
            toast('Error occurred while uploading',
                { description: err.message })
        },
        onUploadBegin: ({ file }) => {
            console.log("upload has begun for", file);
        }
    })


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const file = formData.get("file") as File;
        console.log(file);

        // validation fields

        const validationFileds = schema.safeParse({ file })
        if (!validationFileds.success) {
            toast(
                "Something went wrong",
                { description: validationFileds.error.flatten().fieldErrors.file?.[0] ?? "Invalid file", }
                // variant: "destructive",

            )
            return;
        }

        toast(
            "Uploading PDF...",
            { description: "We are uploading your PDF!" },
        )


        // schema with Zod
        // upload the file to uploadthing

        const response = await startUpload([file])
        if (!response) {
            toast(
                "Something went wrong",
                { description: "Please use a different file!", }
                // variant: "destructive",

            )
            return
        }



        toast(
            "Processing PDF",
            { description: "Hang tight! Our AI is reading through your document!" },
        )

        // parse the pdf using langchain
        const summary = await generatePdfSummary(response)
        console.log({ summary });


        // summarize the pdf using AI
        // save the summary to the Neon Database
        // redirect to the [id] summary page

    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
            <UploadFormInput onSubmit={handleSubmit} />
        </div>
    )
}