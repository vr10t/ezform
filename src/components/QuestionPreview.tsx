import { Button, Layout, Modal } from "antd";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { FaDesktop, FaPhone, FaTablet } from "react-icons/fa";
import type Question from "../models/Question";
import QuestionEditor from "./QuestionEditor";
import { BsPhoneFill } from "react-icons/bs";
import QuestionContent from "./QuestionContent";
import { type TextQuestion } from "../models/TextQuestion";
import RankingQuestionContent from "./RankingQuestionContent";
import { type RankingQuestion } from "../models/RankingQuestion";
import useBuilderStore from "../store/builder-store";
import { Design } from "~/models/Design";

interface QuestionPreviewProps {
    question: Question;
    formId: string;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({ question, formId }) => {
    const [showEditor, setShowEditor] = React.useState(true);
    const [aspectRatio, setAspectRatio] = React.useState<"video" | "tablet" | "phone">("video");
    const { forms, updateForm } = useBuilderStore();
    const imageSize = React.useMemo(() => {
        switch (question.imageFit) {
            case "cover":
                if (question.imagePosition === "center") {
                    return "w-full h-full absolute top-0 left-0";
                } else {
                    return `relative ${aspectRatio === "video" ? "w-2/3 h-full" : "w-full h-2/3"}`;
                }
            default:
                return `relative ${aspectRatio === "video" ? "w-2/3 h-full" : "w-5/6 h-1/2 self-center"}`;
        }
    }, [question, aspectRatio]);
    const form = forms[formId];
    const [design, setDesign] = React.useState<Design>(form?.design ?? new Design());
    const questionContent = React.useMemo(() => {
        switch (question.type) {
            case "text":
                return <QuestionContent design={design} question={question as TextQuestion} />;
            case "ranking":
                return <RankingQuestionContent design={design} question={question as RankingQuestion} />;

            default:
                return null;
        }
    }, [question, design]);
    useEffect(() => {
        if (form) {
            setDesign(form.design ?? new Design());
        }
    }, [form]);

    const [isImageEditing, setIsImageEditing] = React.useState(false);
    if (!form) return null;
    if (!form.design) {
        updateForm(formId, { design: design });
        return null;
    }
    const progress = 67;

    return (
        <Layout className="flex items-center justify-center overflow-hidden bg-blue-400 px-2">
            <div className="flex h-full w-full justify-between bg-red-500 ">
                <div className="flex w-full items-center justify-center bg-green-500 p-2">
                    <div
                        style={{
                            aspectRatio: aspectRatio === "video" ? "16/9" : aspectRatio === "tablet" ? "3/4" : "9/16",
                            flexDirection:
                                aspectRatio === "video"
                                    ? question.imagePosition === "left"
                                        ? "row"
                                        : "row-reverse"
                                    : question.imagePosition === "left"
                                    ? "column"
                                    : "column-reverse",
                            backgroundColor: design.backgroundColor,
                        }}
                        className={`relative flex h-56 sm:h-96 md:h-[30rem]`}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                backgroundColor: design.buttonColor,
                                borderRadius: design.borderRadius,
                            }}
                            className="absolute left-0 top-0 z-20 h-1 "
                        ></div>
                        <div
                            style={{
                                objectFit: question.imageFit,
                                objectPosition: question.imagePosition,
                            }}
                            className={`${imageSize} ${question.imageUrl ? "" : "hidden"} `}
                        >
                            <Image
                                className={` `}
                                style={{
                                    objectFit: question.imageFit,
                                }}
                                unoptimized
                                src={question.imageUrl}
                                alt={question.imageAltText ?? ""}
                                fill
                            />
                        </div>
                        {!isImageEditing && (
                            <div className="z-10 flex h-full w-full items-center justify-center">{questionContent}</div>
                        )}
                        {/* <Button onClick={() => setIsImageEditing(!isImageEditing)}>Edit Image</Button> */}
                    </div>
                </div>
                <div className="relative h-1 w-0 bg-red-500">
                    <div className="absolute right-2 top-2 flex flex-col items-center gap-2 p-2 text-2xl text-white ">
                        <button className="rounded bg-black/30 p-2" onClick={() => setAspectRatio("video")}>
                            <FaDesktop />
                        </button>
                        <button className="rounded bg-black/30 p-2" onClick={() => setAspectRatio("tablet")}>
                            <FaTablet />
                        </button>
                        <button className="rounded bg-black/30 p-2" onClick={() => setAspectRatio("phone")}>
                            <BsPhoneFill />
                        </button>
                    </div>
                </div>
                {showEditor && <QuestionEditor question={question} formId={formId} />}
            </div>
        </Layout>
    );
};

export default QuestionPreview;
