import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, Truck, RotateCcw, X } from "lucide-react";
import { CartItem } from "./cartContext";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  onApplyPromoCode?: (code: string, discount: number) => void;
  onRemovePromoCode?: () => void;
  appliedCode?: string | null;
  readonly?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  shippingCost,
  discount,
  onApplyPromoCode,
  onRemovePromoCode,
  appliedCode,
  readonly = false
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const { toast } = useToast();

  const handleApply = () => {
    if (!promoCode.trim()) return;
    
    const code = promoCode.toUpperCase();
    if (code === "FAHOUD10") {
      onApplyPromoCode?.(code, subtotal * 0.1);
      toast({ title: "تم تطبيق الخصم", description: "تم خصم 10% بنجاح." });
    } else if (code === "WELCOME20") {
      onApplyPromoCode?.(code, subtotal * 0.2);
      toast({ title: "تم تطبيق الخصم", description: "تم خصم 20% كترحيب." });
    } else if (code === "FREESHIP") {
      onApplyPromoCode?.(code, shippingCost);
      toast({ title: "شحن مجاني", description: "تم تطبيق الشحن المجاني بنجاح." });
    } else {
      toast({ title: "كود غير صالح", description: "الكود الذي أدخلته غير صحيح أو منتهي الصلاحية.", variant: "destructive" });
    }
    setPromoCode("");
  };

  const vat = (subtotal - discount) * 0.05;
  const total = subtotal + shippingCost - discount + vat;

  return (
    <div className="bg-muted/30 rounded-2xl p-6 border border-border sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-primary">ملخص الطلب</h2>
        {!readonly && (
          <Link href="/store" className="text-sm font-bold text-secondary hover:underline">
            تعديل
          </Link>
        )}
      </div>

      <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-border">
              {item.image.startsWith("linear-gradient") ? (
                <div className="w-full h-full" style={{ background: item.image }} />
              ) : (
                <img loading="lazy" decoding="async" src={item.image} alt={item.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="font-bold text-primary leading-tight line-clamp-2 text-sm mb-1">{item.name}</h4>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{item.quantity} × ${item.price.toFixed(2)}</span>
                <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!readonly && (
        <div className="mb-6">
          {appliedCode ? (
            <div className="flex items-center justify-between bg-accent/20 border border-accent text-accent-foreground px-4 py-2 rounded-xl">
              <span className="font-bold text-sm">كود الخصم: {appliedCode}</span>
              <button onClick={onRemovePromoCode} className="text-destructive hover:text-destructive/80 transition-colors p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="كود الخصم"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="h-12 rounded-xl bg-white"
              />
              <Button onClick={handleApply} variant="outline" className="h-12 rounded-xl font-bold px-6 border-primary text-primary hover:bg-primary/5">
                تطبيق
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 mb-6 pt-4 border-t border-border/50 text-sm font-semibold">
        <div className="flex justify-between">
          <span className="text-muted-foreground">المجموع الفرعي</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">الشحن</span>
          <span>{shippingCost === 0 ? "مجاناً" : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-destructive">
            <span>الخصم</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">الضريبة (5%)</span>
          <span>${vat.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border mb-6">
        <span className="font-bold text-lg text-primary">المجموع الكلي</span>
        <span className="font-black text-2xl text-secondary">${total.toFixed(2)}</span>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-semibold text-muted-foreground bg-white py-3 rounded-xl border border-border">
        <div className="flex flex-col items-center gap-1">
          <Shield className="h-4 w-4 text-primary" />
          <span>دفع آمن</span>
        </div>
        <div className="w-px h-8 bg-border"></div>
        <div className="flex flex-col items-center gap-1">
          <Truck className="h-4 w-4 text-primary" />
          <span>شحن مضمون</span>
        </div>
        <div className="w-px h-8 bg-border"></div>
        <div className="flex flex-col items-center gap-1">
          <RotateCcw className="h-4 w-4 text-primary" />
          <span>إرجاع 14 يوماً</span>
        </div>
      </div>
    </div>
  );
}
