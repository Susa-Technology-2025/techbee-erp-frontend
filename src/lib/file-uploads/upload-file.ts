"use server";
import { promises as fs } from "fs";
import path from "path";
import { headers } from "next/headers";

export async function uploadImage(formData: FormData, backendId: string) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const hdrs = await headers();
  const host = hdrs.get("host") || "default.susa.et";
  const subdomainMatch = host.match(/^([^.]+)\./);
  const subdomain = subdomainMatch ? subdomainMatch[1] : "default";

  const ext = path.extname(file.name);
  const fileName = `${subdomain}-${backendId}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (err) {
    try {
      await fs.unlink(filePath);
    } catch {}
    throw new Error("Upload failed");
  }
}

export async function uploadFile(formData: FormData, uniqueId: string) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const hdrs = await headers();
  const host = hdrs.get("host") || "default.susa.et";
  const subdomainMatch = host.match(/^([^.]+)\./);
  const subdomain = subdomainMatch ? subdomainMatch[1] : "default";

  const ext = path.extname(file.name);
  const fileName = `${subdomain}-${uniqueId}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (err) {
    try {
      await fs.unlink(filePath);
    } catch {}
    throw new Error("Upload failed");
  }
}
