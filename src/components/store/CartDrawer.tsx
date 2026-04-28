import { useLocation } from "wouter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "./cartContext";

export function CartDrawer() {
  const { state, dispatch, total } = useCart();
  const [, setLocation] = useLocation();

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => dispatch({ type: "TOGGLE_CART", payload: open })}>
      <SheetContent className="w-full sm:max-w-md flex flex-col pt-12">
        <SheetHeader>
          <SheetTitle className="text-2xl font-black text-primary">سلة المشتريات</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-xl font-bold">السلة فارغة</p>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-muted/30 p-4 rounded-2xl">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                  {item.image.startsWith("linear-gradient") ? (
                    <div className="w-full h-full" style={{ background: item.image }} />
                  ) : (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-primary leading-tight line-clamp-2">{item.name}</h4>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="font-black text-secondary">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="flex items-center gap-3 bg-white rounded-full px-2 border border-border">
                      <button 
                        className="p-1 text-primary hover:text-secondary transition-colors disabled:opacity-50"
                        onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-bold text-sm min-w-4 text-center">{item.quantity}</span>
                      <button 
                        className="p-1 text-primary hover:text-secondary transition-colors"
                        onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t border-border pt-6 pb-2">
            <div className="flex justify-between items-center mb-6 text-xl">
              <span className="font-bold text-primary">المجموع</span>
              <span className="font-black text-secondary">${total.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90 rounded-full"
              onClick={() => {
                setLocation("/checkout");
                dispatch({ type: "TOGGLE_CART", payload: false });
              }}
            >
              إتمام الشراء
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
