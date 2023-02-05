import {NextRequest} from "next/server";

export function handler(res: NextRequest) {
    return {
        message:
            "Ah, You're a cheeky one, aren't you? This is a serverless function. You can't see the source code. If you're looking for source code, you'll have to go to the GitHub repo. : )",
    };
}
