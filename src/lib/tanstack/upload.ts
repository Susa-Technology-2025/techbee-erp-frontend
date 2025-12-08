import { useMutation } from "@tanstack/react-query";

type UploadParams = {
  file: File;
  folder: string;
  fileName: string;
  method: "POST" | "PATCH";
};

type UseUploadMutationProps = {
  method: "POST" | "PATCH";
  code: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

export function useUploadMutation({
  method,
  code,
  onSuccess,
  onError,
}: UseUploadMutationProps) {
  return useMutation({
    mutationFn: async ({ file, folder, fileName }: UploadParams) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("fileName", fileName);
      formData.append("contentType", file.type);
      formData.append("overwrite", String(method === "PATCH"));

      const res = await fetch(
        "https://api.techbee.et/api/infra/mediaAssets/upload",
        {
          method,
          headers: {
            "x-tenant-code": code,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess,
    onError,
  });
}
