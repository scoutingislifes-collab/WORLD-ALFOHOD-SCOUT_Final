import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { VideoCard } from "@/components/videos/VideoCard";
import { videos } from "@/data/videos";
import { PlayCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Videos() {
  const featuredVideo = videos[0];
  const gridVideos = videos.slice(1);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SiteLayout>
      <PageHero
        title="مكتبة الفيديوهات"
        description="شاهد قصص النجاح، والفعاليات العالمية، والبرامج التدريبية."
        breadcrumbs={[{ label: "الفيديوهات", href: "/videos" }]}
      />
      
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* Featured Video */}
          <div className="mb-20">
            <div 
              className="relative aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
              onClick={() => setIsOpen(true)}
            >
              <img 
                src={featuredVideo.thumbnail} 
                alt={featuredVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center text-white">
                <PlayCircle className="h-24 w-24 mb-6 text-white/90 group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl md:text-4xl font-black text-center max-w-2xl px-4">{featuredVideo.title}</h2>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-black text-primary mb-10">المزيد من الفيديوهات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
          <DialogTitle className="sr-only">{featuredVideo.title}</DialogTitle>
          <DialogDescription className="sr-only">Video player for {featuredVideo.title}</DialogDescription>
          <div className="aspect-video w-full bg-black">
            <video 
              src={featuredVideo.url} 
              controls 
              autoPlay 
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>

    </SiteLayout>
  );
}
