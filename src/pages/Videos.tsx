import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { VideoCard } from "@/components/videos/VideoCard";
import { videos } from "@/data/videos";
import { PlayCircle, Sparkles, Tv, Mic, Compass, GraduationCap, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CinematicHeroSlider, CinematicSlide } from "@/components/store/CinematicHeroSlider";
import { OffersTicker } from "@/components/store/OffersTicker";
import { BentoGrid, BentoItem } from "@/components/store/BentoGrid";
import { Carousel3D, Carousel3DItem } from "@/components/store/Carousel3D";
import { LiveActivityFeed } from "@/components/store/LiveActivityFeed";

const PLAYLIST_ICONS: Record<string, JSX.Element> = {
  "الجمبوريات": <Tv className="h-5 w-5" />,
  "الإعلانات الرسمية": <Mic className="h-5 w-5" />,
  "البرامج التعليمية": <GraduationCap className="h-5 w-5" />,
  "قصص الأعضاء": <Users className="h-5 w-5" />,
};

export default function Videos() {
  const [openVideo, setOpenVideo] = useState<typeof videos[number] | null>(null);
  const featuredVideo = videos[0];
  const gridVideos = videos.slice(1);

  // Build hero slides from top videos
  const heroSlides: CinematicSlide[] = videos.slice(0, 3).map((v, i) => ({
    id: v.id,
    badge: i === 0 ? "أكثر مشاهدة" : i === 1 ? "وصل حديثاً" : "مميز",
    title: v.title,
    subtitle: `${v.playlist} • ${v.duration}`,
    ctaLabel: "شاهد الآن",
    ctaHref: "#video-grid",
    image: v.thumbnail,
    accent: ["#D4AF37", "#F5E199", "#E6C56C"][i],
    background: "linear-gradient(135deg, #050505 0%, #1a1408 50%, #050505 100%)",
  }));

  // Group by playlist for bento
  const playlistGroups = useMemo(() => {
    const map = new Map<string, typeof videos>();
    for (const v of videos) {
      const arr = map.get(v.playlist) || [];
      arr.push(v);
      map.set(v.playlist, arr);
    }
    return Array.from(map.entries());
  }, []);

  const bentoItems: BentoItem[] = playlistGroups.map(([name, vids], i) => ({
    id: name,
    title: name,
    subtitle: `${vids.length} مقطع`,
    href: "#video-grid",
    image: vids[0].thumbnail,
    accent: ["#D4AF37", "#F5E199", "#E6C56C", "#FFD700"][i % 4],
    icon: PLAYLIST_ICONS[name] || <Sparkles className="h-5 w-5" />,
    span: i === 0 ? "wide" : "default",
  }));

  // Related items for the 3D carousel (use all videos)
  const carouselItems: Carousel3DItem[] = videos.map(v => ({
    id: v.id,
    title: v.title,
    subtitle: v.playlist,
    image: v.thumbnail,
    href: "#video-grid",
  }));

  return (
    <SiteLayout>
      <CinematicHeroSlider slides={heroSlides} />

      <OffersTicker
        items={[
          { id: "v1", icon: "youtube", text: "قائمة تشغيل جديدة: مهارات التخييم المتقدمة" },
          { id: "v2", icon: "sparkles", text: "حلقة الأسبوع: كيف تصبح قائداً ملهماً" },
          { id: "v3", icon: "bell", text: "بث مباشر قادم: المخيم الإقليمي السنوي" },
          { id: "v4", icon: "tag", text: "اشترك في القناة لتصلك جميع الإصدارات" },
        ]}
      />

      <BentoGrid title="قوائم التشغيل" items={bentoItems} />

      <section id="video-grid" className="py-20 bg-[#050505] text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div
              className="relative aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden cursor-pointer group shadow-2xl border border-[#D4AF37]/30"
              onClick={() => setOpenVideo(featuredVideo)}
              data-testid="video-featured"
              style={{ boxShadow: "0 30px 80px -20px rgba(212,175,55,0.35)" }}
            >
              {featuredVideo.thumbnail.startsWith("linear-gradient") ? (
                <div className="absolute inset-0" style={{ background: featuredVideo.thumbnail }} />
              ) : (
                <img
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 transition-colors flex flex-col items-center justify-center text-white">
                <PlayCircle className="h-24 w-24 mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl md:text-4xl font-black text-center max-w-2xl px-4">{featuredVideo.title}</h2>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-black mb-10 text-center">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5E199] to-[#D4AF37] bg-clip-text text-transparent">
              المزيد من الفيديوهات
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridVideos.map(video => (
              <div key={video.id} onClick={() => setOpenVideo(video)} className="cursor-pointer">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Carousel3D title="مكتبة سكاوت تيوب — المختارات" items={carouselItems} />

      <Dialog open={!!openVideo} onOpenChange={(o) => !o && setOpenVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-[#D4AF37]/30">
          <DialogTitle className="sr-only">{openVideo?.title}</DialogTitle>
          <DialogDescription className="sr-only">Video player for {openVideo?.title}</DialogDescription>
          {openVideo && (
            <div className="aspect-video w-full bg-black">
              <video src={openVideo.url} controls autoPlay className="w-full h-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <LiveActivityFeed />
    </SiteLayout>
  );
}
