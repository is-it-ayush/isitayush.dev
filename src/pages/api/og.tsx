import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default function og(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "a y u s h.";
  const author = searchParams.get("date") || "Ayush Gupta";

  return new ImageResponse(
    (
      <div tw="flex flex-col bg-white h-full w-full justify-center items-start p-10">
        <div tw="text-white font-light p-3 text-[65px] flex flex-col flex-wrap border-2 border-black bg-black">
          <div>{title}</div>
        </div>
        <div tw="flex flex-row justify-center items-center">
          <div tw="flex mt-2 pr-2">{author}</div>
          <div tw="flex">|</div>
          <div tw="flex pl-2 text-gray-700 mt-2">isitayush.dev</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}
