import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;

type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login["$post"]({ json });
      return response.json();
    },
    onSuccess: (response) => {
      if(!response.success){
        toast.error(response.message)
        return;
      }
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Failed to login")
    }
  });

  return mutation;
};
