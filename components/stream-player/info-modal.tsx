"use client"


import {Dialog,DialogClose,DialogContent,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
import {Label} from '@/components/ui/label'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import { updateStream } from "@/actions/stream";

import { UploadDropzone } from "@/lib/uploadthing";
import { useState, useTransition, useRef, ElementRef } from "react";
import { toast } from "sonner";
import { Hint } from "../hint";
import { Trash } from "lucide-react";
import Image from "next/image";

interface InfoModalProps {
    initialName:  string;
    initialThumbnailUrl:string | null;
};


export const InfoModal = ({initialName,initialThumbnailUrl}:InfoModalProps) => {

    const [name,setName] = useState(initialName);
    const [thumbnailUrl,setThumbnailUrl] = useState(initialThumbnailUrl);

    const [isPending,startTransition] = useTransition()

    const closeRef = useRef<ElementRef<"button">>(null)

    const router = useRouter()

    const onRemove = () => {
        startTransition(()=> {
            updateStream({ thumbnailUrl: null })
            .then(()=>{
                toast.success("Thumbnail Removed")
                setThumbnailUrl("")
                closeRef?.current?.click();
            })
            .catch(()=> toast.error("Something went wrong"))
        })
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const onSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        startTransition(()=> {
            updateStream({ name: name})
            .then(() => {
                toast.success("Stream Updated")
                closeRef?.current?.click();
            })
            .catch(()=>toast.error("Something went  wrong"));
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                variant="link"
                size="sm"
                className="ml-auto">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Stream Info</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-14">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input 
                        placeholder="Stream name"
                        onChange={onChange}
                        value={name}
                        disabled={isPending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Thumbnail
                        </Label>
                        {thumbnailUrl ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                <div className="absolute top-2 right-2 z-[10]">
                                    <Hint label="Remove Thumbnail" asChild side="left">
                                        <Button 
                                        type="button"
                                        className="h-auto w-auto p-1.5"
                                        disabled={isPending}
                                        onClick={onRemove}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </Hint> 
                                </div>
                                <Image 
                                src={thumbnailUrl}
                                alt="Thumbnail"
                                fill
                                className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="rounded-xl border outline-dashed outline-muted">
                            <UploadDropzone 
                            endpoint="thumbnailUploader"
                            appearance={{
                                label: {
                                    color: "#FFFFFF",
                                },
                                allowedContent:{
                                    color: "#FFFFFF"
                                }
                            }}
                            onClientUploadComplete={(res) => {
                                setThumbnailUrl(res?.[0]?.url);
                                closeRef?.current?.click();
                                router.refresh();
                            }}
                            />
                        </div>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <DialogClose ref={closeRef} asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="primary" type="submit" disabled={isPending}>
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}