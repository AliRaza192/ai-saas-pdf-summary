"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface UploadFormInputProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function UploadFormInput({ onSubmit }: UploadFormInputProps) {
    return (
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <div className="flex justify-end items-center gap-1.5">
                <Input
                    type="file"
                    id="file"
                    name="file"
                    accept="application/pdf"
                    required
                    className=""
                />
                <Button className="bg-rose-500 text-white hover:bg-rose-400 hover:text-white">Upload Your PDF</Button>
            </div>
        </form>
    )
}