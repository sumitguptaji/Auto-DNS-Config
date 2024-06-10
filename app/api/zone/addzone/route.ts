import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { apiKey, domainName } = await request.json();

    const data = {
      account: { id: "2f3c9a94b2b8e91f27eaaaab12e70b3e" },
      name: domainName,
      type: "full",
    };

    const headers= {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }

    const result: any = await axios.post("https://api.cloudflare.com/client/v4/zones",
      data,
      {
        headers,
      }
    );


    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
