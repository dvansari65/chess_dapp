import { createChallenge } from "@/services/service";
import { emitToUser } from "@/socket/emit";
import { NextResponse } from "next/server";

export const POST = async (req: NextResponse) => {
  let body;
  try {
    body = await req.json();
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Invalid JSON format!",
        success: false,
      },
      { status: 500 }
    );
  }
  try {
    const { senderPublickey, receiverPublicKey, amount } = body;
    if (!senderPublickey) {
      return NextResponse.json(
        {
          message: "Sender public key not provided!",
          success: false,
        },
        {
          status: 400,
        }
      );
    }
    if (!receiverPublicKey) {
      return NextResponse.json(
        {
          message: "Receiver public key not provided!",
          success: false,
        },
        {
          status: 400,
        }
      );
    }
    if (!amount) {
      return NextResponse.json(
        {
          message: "Amount not provided!",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const challenge = await createChallenge({
      receiverPublicKey: receiverPublicKey,
      senderPublickey: senderPublickey,
      amount: amount,
    });

    //  Emitting the event to the reciever from the api!
    emitToUser(receiverPublicKey,"recieve-challenge",challenge)

    return NextResponse.json(
        {
            message:"Challenge sent successfully!",
            success:true,
            challenge
        },
        {
            status:200
        }
    )

  } catch (error:any) {
    return NextResponse.json(
        {
            message:error.message || "Failed to send challenge!",
            success:false
        },
        {
            status:500
        }
    )
  }
};
