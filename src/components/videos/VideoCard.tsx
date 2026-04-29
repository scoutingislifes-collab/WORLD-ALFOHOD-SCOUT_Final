import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    url: string;
    playlist: string;
  };
}

export function VideoCard({ video }: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isGradient = video.thumbnail.startsWith("linear-gradient");

  return (
    <>
      <Card className="h-full overflow-hidden border-border/50 group bg-white hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="relative h-48 overflow-hidden bg-muted/30">
          {isGradient ? (
            <div className="w-full h-full" style={{ background: video.thumbnail }} />
          ) : (
            <img loading="lazy" decoding="async" 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-white/80 group-hover:scale-110 transition-transform" />
          </div>
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
            {video.duration}
          </div>
          <div className="absolute top-3 right-3 bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">
            {video.playlist}
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
            {video.title}
          </h3>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          <DialogTitle className="sr-only">{video.title}</DialogTitle>
          <DialogDescription className="sr-only">Video player for {video.title}</DialogDescription>
          <div className="aspect-video w-full bg-black">
            <video 
              src={video.url} 
              controls 
              autoPlay 
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
