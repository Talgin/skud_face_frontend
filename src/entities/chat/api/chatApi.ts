import { t } from "@/shared/i18n";
import { createSseParser } from "../lib/sse";
import type {
  Attachment,
  ChatMessage,
  Conversation,
  StreamEvent,
  VideoJob,
} from "../model/types";
export const CHAT_BASE = "/api/chat";

export class ChatApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  token: string | undefined,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const r = await fetch(`${CHAT_BASE}${path}`, { ...init, headers });
  if (!r.ok) throw await toError(r);
  if (r.status === 204) return undefined as T;
  return (await r.json()) as T;
}

async function toError(r: Response): Promise<ChatApiError> {
  let detail = r.statusText;
  try {
    const body = await r.json();
    detail = typeof body.detail === "string" ? body.detail : detail;
  } catch {
    /* not json */
  }
  if (r.status === 401) detail = t("Сессия истекла, войдите заново");
  if (r.status === 413) detail = t("Файл слишком большой");
  return new ChatApiError(detail, r.status);
}

export const chatApi = {
  listConversations: (token?: string) =>
    request<Conversation[]>(token, "/conversations"),

  createConversation: (token?: string) =>
    request<Conversation>(token, "/conversations", {
      method: "POST",
      body: JSON.stringify({}),
    }),

  getConversation: (token: string | undefined, id: string) =>
    request<{ conversation: Conversation; messages: ChatMessage[] }>(
      token,
      `/conversations/${id}`,
    ),

  renameConversation: (token: string | undefined, id: string, title: string) =>
    request<Conversation>(token, `/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),

  deleteConversation: (token: string | undefined, id: string) =>
    request<void>(token, `/conversations/${id}`, { method: "DELETE" }),

  getVideoJob: (token: string | undefined, id: string) =>
    request<VideoJob>(token, `/videos/${id}`),

  cancelVideoJob: (token: string | undefined, id: string) =>
    request<unknown>(token, `/videos/${id}/cancel`, { method: "POST" }),

  // XHR, not fetch: fetch has no upload progress
  upload(
    token: string | undefined,
    convId: string,
    file: File,
    onProgress: (fraction: number) => void,
    signal?: AbortSignal,
  ): Promise<Attachment> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${CHAT_BASE}/uploads`);
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded / e.total);
      };
      xhr.onload = () => {
        let body: { detail?: string } & Partial<Attachment> = {};
        try {
          body = JSON.parse(xhr.responseText);
        } catch {
          /* empty */
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(body as Attachment);
        } else {
          const msg =
            xhr.status === 413
              ? t("Файл слишком большой")
              : typeof body.detail === "string"
                ? body.detail
                : t("Ошибка загрузки ({status})", { status: xhr.status });
          reject(new ChatApiError(msg, xhr.status));
        }
      };
      xhr.onerror = () => reject(new ChatApiError(t("Сеть недоступна"), 0));
      xhr.onabort = () => reject(new ChatApiError(t("Загрузка отменена"), 0));
      signal?.addEventListener("abort", () => xhr.abort());
      const form = new FormData();
      form.append("conv_id", convId);
      form.append("file", file);
      xhr.send(form);
    });
  },

  async send(
    token: string | undefined,
    convId: string,
    content: string,
    attachmentIds: string[],
    onEvent: (e: StreamEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    const r = await fetch(`${CHAT_BASE}/conversations/${convId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content, attachment_ids: attachmentIds }),
      signal,
    });
    if (!r.ok || !r.body) throw await toError(r);
    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    const feed = createSseParser((data) => {
      try {
        onEvent(JSON.parse(data) as StreamEvent);
      } catch {
        /* ignore a malformed event */
      }
    });
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      feed(decoder.decode(value, { stream: true }));
    }
  },
};

// <img>/<video> cannot send headers: the token goes in the query string
export function uploadUrl(url: string, token?: string): string {
  return token ? `${url}?token=${encodeURIComponent(token)}` : url;
}
