import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { apiKey, zoneId, type, name, content, ttl, proxied, dns_id } =
    await req.json();

  try {
    const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${dns_id}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };

    var options = {
      method: "PATCH",
      url: apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      data: {
        content: content,
        name: name,
        proxied: proxied,
        type: type,
        ttl: ttl,
      },
    };

    const result = await axios.request(options);

    if (result?.statusText != "OK")
      return NextResponse.json(
        { message: "DNS record not updated ." },
        { status: 400 }
      );


    return NextResponse.json(
      { message: "DNS records updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Error updated DNS records:", error);
    return NextResponse.json(
      { message: "Error updated DNS records" },
      { status: 500 }
    );
  }
}
