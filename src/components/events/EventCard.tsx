import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: {
    slug: string;
    title: string;
    date: string;
    location: string;
    type: string;
    image: string;
    description: string;
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 group bg-white hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden bg-muted/30">
          <img loading="lazy" decoding="async" 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 z-20 bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold">
            {event.type}
          </div>
        </div>
        <CardContent className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-bold text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-primary mb-3 group-hover:text-secondary transition-colors">
            {event.title}
          </h3>
          
          <p className="text-muted-foreground mb-6 line-clamp-2">
            {event.description}
          </p>
          
          <div className="mt-auto">
            <Link href={`/events/${event.slug}`}>
              <Button variant="outline" className="font-bold">
                التفاصيل والتسجيل
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
