import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import React, { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import { UploadResponse } from "imagekit-javascript/dist/src/interfaces/UploadResponse";

interface ImgState {
  isLoading: boolean;
  error: string;
  dbData: Record<string, unknown>;
  aiData: {
    inlineData?: {
      data: string;
      mimeType: string;
    };
  };
}
interface UploadProps {
  setImg: Dispatch<SetStateAction<ImgState>>;
}

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;
interface ImgState {
  isLoading: boolean;
  error: string;
  dbData: Record<string, unknown>;
  aiData: {
    inlineData?: {
      data: string;
      mimeType: string;
    };
  };
}

const authenticator = async()=>{
    try{
        const response = await fetch('http://localhost:3000/api/upload');

        if(!response.ok){
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const {signature, expire, token} = data;
        return {signature, expire, token};
    } catch (error: unknown) {
      if (error instanceof Error) {
          throw new Error(`Authentication request failed: ${error.message}`);
      } else {
          throw new Error("Authentication request failed with an unknown error.");
      }
  }
}
const Upload: React.FC<UploadProps> = ({setImg}) => {
  const ikUploadRef = useRef<HTMLInputElement | null>(null);
  const onError = (err: unknown) => {
    console.log("Error", err);
  };

  const onSuccess = (res: UploadResponse): void => {
    console.log("Success", res);
    setImg((prev) => ({
      ...prev,
      isLoading: false,
      dbData: {...res}
    }));
  };

  const onUploadProgress = (progress: { loaded: number; total: number }) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg((prev) => ({
        ...prev,
        isLoading: true,
        aiData: {
          inlineData: {
            data: (reader.result as string).split(",")[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      {
        <label onClick={() => {
          if (ikUploadRef.current) {
            ikUploadRef.current.click(); // Safely access current after checking
          }
        }}>
          <img src="/attachment.png" alt="" height={40} width={40} />
        </label>
      }
    </IKContext>
  )
}

export default Upload