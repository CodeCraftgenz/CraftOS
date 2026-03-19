/// Sistema de notificações toast usando Sonner

import { Toaster, toast } from "sonner";

/** Componente Toaster — renderizar uma vez no App.tsx */
export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#18181b",
          border: "1px solid #27272a",
          color: "#fafafa",
          fontSize: "13px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        },
      }}
      gap={8}
    />
  );
}

/** Helpers para notificações */
export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (id?: string | number) => toast.dismiss(id),
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => toast.promise(promise, messages),
};
