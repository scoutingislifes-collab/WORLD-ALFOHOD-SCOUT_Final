import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون أكثر من حرفين" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  subject: z.string().min(5, { message: "الموضوع يجب أن يكون أكثر من 5 أحرف" }),
  message: z.string().min(10, { message: "الرسالة يجب أن تكون أكثر من 10 أحرف" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submit = useMutation({
    mutationFn: async (values: FormValues) => {
      return await apiRequest("POST", "/api/contact", values);
    },
    onSuccess: () => {
      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنتواصل معك في أقرب وقت ممكن.",
      });
      form.reset();
    },
    onError: (err: any) => {
      toast({
        title: "تعذّر إرسال الرسالة",
        description: err?.message || "يرجى المحاولة مرة أخرى لاحقاً.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: FormValues) {
    submit.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الكامل</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسمك" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input placeholder="أدخل بريدك الإلكتروني" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الموضوع</FormLabel>
              <FormControl>
                <Input placeholder="موضوع الرسالة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرسالة</FormLabel>
              <FormControl>
                <Textarea placeholder="اكتب رسالتك هنا..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={submit.isPending}
          className="w-full h-14 text-lg font-bold rounded-full bg-secondary text-white hover:bg-secondary/90 gap-2"
          data-testid="button-contact-submit"
        >
          {submit.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جارٍ الإرسال...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              إرسال الرسالة
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
