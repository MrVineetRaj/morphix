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

export default function UploadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTransformations, setSelectedTransformations] =
    useState<string>("");
  const [videoURL, setVideoURL] = useState<string>("");

  const [isUploading, setIsUploading] = useState(false);

  const { user, isSignedIn } = useUser();

  const router = useRouter();

  const handleTransformationToggle = (value: string) => {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    console.log(user);
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

    if (res) {
      onClose();
    }
  };

  const handleUploadSuccess = (file: OutputFileEntry) => {
    console.log("File uploaded successfully:", file);
    setVideoURL(file.cdnUrl as string);
  };

  const handleDeleteVideo = async () => {
    try {
      const res = await axios.delete("/api/uploadcare", {
        data: {
          uuid: videoURL.split("/").pop(),
        },
      });
      if (res.status === 200) {
        setVideoURL("");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
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
              {videoURL && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeleteVideo}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Remove Video
                </Button>
              )}
              <FileUploaderRegular
                sourceList="local, camera, facebook, gdrive"
                accept=".mp4, .mov"
                classNameUploader="uc-dark"
                pubkey="ab27482ee0f7b405353d"
                onFileUploadSuccess={handleUploadSuccess}
              />
            </div>
          </div>

          {videoURL && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter video description"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Transformations</Label>
                <Input
                  type="text"
                  value={selectedTransformations}
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
