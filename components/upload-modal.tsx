"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import "@uploadcare/react-uploader/core.css";

import {
  FileUploaderRegular,
  OutputFileEntry,
} from "@uploadcare/react-uploader";
import axios from "axios";
import { createVideo } from "@/lib/api_calls/video";
import { useManageCredit } from "@/hooks/manage-credit";

export default function UploadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const { setCredits } = useManageCredit();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedTransformations, setSelectedTransformations] =
    useState<string>("");
  const [videoURL, setVideoURL] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { user, isSignedIn } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    // checks if user is signed in or not
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    
    // if signed in then call create video
    const res = await createVideo(
      videoURL,
      selectedTransformations,
      title,
      description,
      user.id,
      {
        fullName: user.fullName as string,
        avatar: user.imageUrl,
      }
    );

    setIsUploading(false);

    if (res?.success) {
      setCredits(res?.result?.credits);
      onClose();
    }
  };


  // on success of upload  using upload care record the returned video url
  const handleUploadSuccess = (file: OutputFileEntry) => {
    console.log("File uploaded successfully:", file);
    setVideoURL(file.cdnUrl as string);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Video</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 pt-2 flex flex-col items-center"
        >
          <div className="flex flex-col items-center space-x-2">
            {videoURL && (
              <video
                src={videoURL}
                controls
                className="w-full h-auto rounded-lg"
              />
            )}
            <div className="flex items-center gap-2">
              {videoURL && <p className="">To Remove Video</p>}
              <FileUploaderRegular
                sourceList="local, camera, facebook, gdrive"
                accept=".mp4, .mov"
                classNameUploader="uc-dark"
                pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY as string}
                onFileUploadSuccess={handleUploadSuccess}
              />
            </div>
          </div>

          {videoURL && (
            <>
              <div className="space-y-2 w-full">
                <Label htmlFor="title" className="w-full">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="description" className="w-full">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="space-y-3 w-full">
                <Label className="w-full">Transformations</Label>
                <Input
                  type="text"
                  value={selectedTransformations}
                  className="w-full"
                  onChange={(e) => setSelectedTransformations(e.target.value)}
                  placeholder="Enter your prompt"
                />
              </div>

              <div className="flex justify-end gap-2">
                {!isUploading ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isUploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload Video"}
                    </Button>
                  </>
                ) : (
                  <p className="p-2 font-semibold text-white bg-secondary rounded-lg">
                    Initializing transformation...
                  </p>
                )}
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
