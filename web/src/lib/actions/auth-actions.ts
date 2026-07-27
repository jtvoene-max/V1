"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { t } from "@/lib/i18n";

const registerSchema = z
  .object({
    name: z.string().min(2, t.auth.foutNaam),
    email: z.string().email(t.auth.foutEmail),
    password: z.string().min(8, t.auth.foutWachtwoord),
    accountType: z.enum(["PRIVATE", "BUSINESS"]),
    companyName: z.string().optional(),
    vatNumber: z.string().optional(),
    kvkNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === "BUSINESS") {
      if (!data.companyName?.trim()) {
        ctx.addIssue({ code: "custom", path: ["companyName"], message: t.auth.foutBedrijfsnaam });
      }
      if (!data.kvkNumber?.trim()) {
        ctx.addIssue({ code: "custom", path: ["kvkNumber"], message: t.auth.foutKvk });
      }
    }
  });

export type FormState = { error?: string } | undefined;

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    accountType: formData.get("accountType"),
    companyName: formData.get("companyName") || undefined,
    vatNumber: formData.get("vatNumber") || undefined,
    kvkNumber: formData.get("kvkNumber") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: t.auth.foutBestaat };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: parsed.data.name,
      accountType: parsed.data.accountType,
      companyName: parsed.data.accountType === "BUSINESS" ? parsed.data.companyName : null,
      vatNumber: parsed.data.accountType === "BUSINESS" ? parsed.data.vatNumber : null,
      kvkNumber: parsed.data.accountType === "BUSINESS" ? parsed.data.kvkNumber : null,
    },
  });
  await logAudit(prisma, {
    entityType: "USER",
    entityId: user.id,
    action: "CREATED",
    toValue: parsed.data.accountType,
    actorId: user.id,
  });

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/",
  });
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? "").toLowerCase(),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: t.auth.foutInlog };
    }
    throw error; // redirect() gooit intern een error die door moet
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/");
}
