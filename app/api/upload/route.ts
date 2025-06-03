import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const UPLOAD_CONFIGS = {
  pet: {
    folder: "pets",
    maxWidth: 1024,
    quality: 80,
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  user: {
    folder: "users",
    maxWidth: 512,
    quality: 85,
    maxSize: 3 * 1024 * 1024, // 3MB
  },
  profile: {
    folder: "profiles",
    maxWidth: 400,
    quality: 90,
    maxSize: 2 * 1024 * 1024, // 2MB
  },
  timeline_photo: { 
    folder: "timeline",   
    maxWidth: 1920,               
    quality: 85,                 
    maxSize: 5 * 1024 * 1024,     
  },
} as const;

type UploadType = keyof typeof UPLOAD_CONFIGS;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log("Auth error:", authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User authenticated:", user.id);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "pet";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!(type in UPLOAD_CONFIGS)) {
      return NextResponse.json(
        {
          error:
            "Invalid upload type. Use: " +
            Object.keys(UPLOAD_CONFIGS).join(", "),
        },
        { status: 400 }
      );
    }

    const config = UPLOAD_CONFIGS[type as UploadType];

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    if (file.size > config.maxSize) {
      const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
      return NextResponse.json(
        {
          error: `File size must be less than ${maxSizeMB}MB for ${type} images`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const optimized = await sharp(buffer)
      .resize({ width: config.maxWidth, withoutEnlargement: true })
      .jpeg({ quality: config.quality })
      .toBuffer();

    const filename = `${randomUUID()}.jpg`;
    const path = `${config.folder}/${filename}`;
    const bucket = "images";

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, optimized, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json(
      {
        url: publicUrl,
        type: type,
        path: path,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
