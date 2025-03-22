"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";


interface UploadFormInputProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export const UploadFormInput = forwardRef<HTMLInputElement, UploadFormInputProps>(({ onSubmit, isLoading }, ref) => {
    return (
        <form ref={ref} className="flex flex-col gap-6" onSubmit={onSubmit}>
            <div className="flex justify-end items-center gap-1.5">
                <Input
                    type="file"
                    id="file"
                    name="file"
                    accept="application/pdf"
                    required
                    className={cn(isLoading && "opacity-50 cursor-not-allowed")}
                    disabled={isLoading}
                />
                <Button disabled={isLoading} className="bg-rose-500 text-white hover:bg-rose-400 hover:text-white">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                        </>) : (
                        "Upload Your PDF"
                    )}
                </Button>
            </div>
        </form>
    )
})

UploadFormInput.displayName = "UploadFormInput";
export default UploadFormInput;
