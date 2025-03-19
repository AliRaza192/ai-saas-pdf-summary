"use client"
import UploadFormInput from "@/components/upload/upload-form-input";
import { z } from "zod";


const schema = z.object({
    file: z.instanceof(File, { message: "Invalid file" })
        .refine((file) => file.size <= 20 * 1024 * 1024,
            'File must be less then 20MB')
        .refine((file) => file.type.startsWith('application/pdf'),
            'File must be a PDF')
})

export default function UploadForm() {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Submitted");

        const formData = new FormData(e.currentTarget);
        const file = formData.get("file") as File;
        console.log(file);

        // validation fields

        const validationFileds = schema.safeParse({ file })
        if (!validationFileds.success) {
            console.log(validationFileds.error.flatten().fieldErrors.file?.[0] ?? "Invalid file");
            return;
        }

        console.log(validationFileds);
        

        // schema with Zod
        // upload the file to uploadthing
        // parse the pdf using langchain
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