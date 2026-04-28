import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { EventCard } from "@/components/events/EventCard";
import { events } from "@/data/events";

export default function Events() {
  return (
    <SiteLayout>
      <PageHero
        title="الفعاليات"
        description="شارك في الفعاليات والمخيمات المحلية والإقليمية والعالمية."
        breadcrumbs={[{ label: "الفعاليات", href: "/events" }]}
      />
      
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex flex-col gap-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
