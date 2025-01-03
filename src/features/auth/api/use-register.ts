import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;

type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register["$post"]({ json });
      return response.json();
    },
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Failed to register");
    },
  });

  return mutation;
};
