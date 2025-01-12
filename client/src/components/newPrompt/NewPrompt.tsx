import { useEffect, useRef, useState } from "react";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import model from "../../lib/gemini";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const NewPrompt = ({ data }:any) => {
  const [img, setImg] = useState<any>({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  //console.log("data at newPrompt", data.history[0]);
  const temp = data?.history.map(({ role, parts }: any) => {
    // Log the role value
    //console.log('Role:', role);

    return {
      role,
      parts: [{ text: parts[0].text }],
    };
  });
  console.log("temp is ", temp)
  const chat = model.startChat({
    history: temp,
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });
  console.log("chat at newPrompt is ", chat);
  // const chat = model.startChat({
  //   history: [
  //     data?.history.map(({ role, parts }:any) => ({
        
  //       role,
  //       parts: [{ text: parts[0].text }],
  //     })),
  //   ],
  //   generationConfig: {
  //     // maxOutputTokens: 100,
  //   },
  // });

  const endref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    endref.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current?.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const add = async (text:any, isInitial:boolean) => {
    if (!isInitial) setQuestion(text);

    try {
      console.log("chat at newPrompt", chat);
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    console.log("e in NP", e.target);
    const text = e.target.text.value;
    console.log("text in NP", text);
    if (!text) return;

    add(text, false);
  };
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);
  return (
    <>
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: "380" }]}
        />
      )}
      {question && <div className="p-5 bg-[#2c2937] rounded-[20px] max-w-[80%] self-end">{question}</div>}
      {answer && (
        <div className="p-5">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="pb-[100px]" ref={endref}></div>
      <form className="w-[50%] absolute bottom-0 bg-[#2c2937] rounded-[20px] flex items-center gap-5 py-0 px-5" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg = {setImg}/>
        <input id="file" type="file" multiple={false} hidden />
        <input
          type="text"
          name="text"
          placeholder="Ask anything..."
          className="flex-[1] p-5 border-none bg-transparent outline-none text-[#ececec]"
        />
        <button className="rounded-[50%] bg-[#605e68] border-none p-[10px] flex items-center justify-center">
          <img src="/arrow.png" alt="" className="w-4 h-4" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
