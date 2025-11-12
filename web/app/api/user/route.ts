import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const users = await prisma.player.findMany({});

    if (!users || users.length === 0) {
      return NextResponse.json(
        {
          message: "No users found!",
          users: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Users found successfully!",
        users,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        error: error.message,
        success: false,
        users: [], // ✅ fixed key name
      },
      { status: 500 }
    );
  }
};
