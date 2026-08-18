import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore";

import { db } from "@/integrations/firebase/client";
import type { AnalysisReport } from "@/lib/analysis-types";

export type AnalysisRow = {
  id: string;
  title: string;
  kind: string;
  created_at: string;
  image_data_url: string | null;
  report: AnalysisReport;
};

// Firestore documents are capped at ~1 MiB, so skip oversized inline images.
const MAX_IMAGE_CHARS = 700_000;

export async function saveAnalysis(input: {
  userId: string;
  kind: string;
  title: string;
  imageDataUrl: string | null;
  report: AnalysisReport;
}) {
  await addDoc(collection(db, "analyses"), {
    userId: input.userId,
    kind: input.kind,
    title: input.title,
    imageDataUrl:
      input.imageDataUrl && input.imageDataUrl.length <= MAX_IMAGE_CHARS
        ? input.imageDataUrl
        : null,
    report: input.report,
    createdAt: serverTimestamp(),
  });
}

export async function listAnalyses(userId: string): Promise<AnalysisRow[]> {
  const snap = await getDocs(
    query(collection(db, "analyses"), where("userId", "==", userId), orderBy("createdAt", "desc")),
  );
  return snap.docs.map((d) => {
    const data = d.data() as {
      title?: string;
      kind?: string;
      imageDataUrl?: string | null;
      report: AnalysisReport;
      createdAt?: Timestamp | null;
    };
    return {
      id: d.id,
      title: data.title ?? "Analysis",
      kind: data.kind ?? "plant",
      created_at: (data.createdAt?.toDate() ?? new Date()).toISOString(),
      image_data_url: data.imageDataUrl ?? null,
      report: data.report,
    };
  });
}

export async function deleteAnalysis(id: string) {
  await deleteDoc(doc(db, "analyses", id));
}
